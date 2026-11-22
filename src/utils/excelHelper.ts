import * as XLSX from 'xlsx';
import type { FormulaComponent, LoteFormula, ProcessType, AssortmentInk } from '../types/ink';

function generateId() {
  return crypto.randomUUID();
}

function generateUniqueLoteNumber(existing: LoteFormula[]): string {
  const year = new Date().getFullYear().toString().slice(-2);
  let seq = 1;
  const existingNums = new Set(existing.map((l) => l.loteNumber));
  while (existingNums.has(`LT${year}/${String(seq).padStart(3, '0')}`)) {
    seq++;
  }
  return `LT${year}/${String(seq).padStart(3, '0')}`;
}

export function exportFormulasToExcel(lotes: LoteFormula[], assortments: AssortmentInk[] = []): void {
  const toInfRow = (l: LoteFormula) => ({
    Lote: l.loteNumber,
    Versao: l.currentVersion,
    Processo: l.process,
    Cor: l.colorName,
    CodigoCor: l.colorCode,
    Produto: l.product,
    SAP: l.sapCode,
    Maquina: l.machine,
    Descricao: l.description,
    HEX: l.colorRef.hex || '',
    Pantone: l.colorRef.pantone || '',
    RGB: l.colorRef.rgb || '',
    TotalGramas: l.totalGrams,
    Criador: l.createdBy,
    CriadoEm: l.createdAt,
    Validade: l.validity || '',
  });

  const flexoRows = lotes.filter((l) => l.process === 'FLEXO').map(toInfRow);
  const letterRows = lotes.filter((l) => l.process === 'LETTER').map(toInfRow);

  const compRows = lotes.flatMap((l) =>
    l.components.map((c, idx) => ({
      Lote: l.loteNumber,
      Versao: l.currentVersion,
      Ordem: idx + 1,
      CodigoSAP: c.codeSap,
      Componente: c.name,
      Percentual: c.percentage,
      Gramas: c.grams ?? (l.totalGrams * c.percentage) / 100,
      Fornecedor: c.supplier || '',
      Validade: c.expiryDate || '',
    }))
  );

  const tintasRows = assortments.map((b) => ({
    CodigoSortimento: b.assortmentCode,
    Fornecedor: b.supplierName,
    Serie: b.series,
    NomeTinta: b.name,
    CIPigmento: b.ciPigment || '',
    Funcao: b.role,
    EstoqueKG: b.stockKg,
    EstoqueMinKG: b.minStockKg,
    CustoKgBRL: b.estimatedCostPerKgBrl,
    EquivalentesSAP: b.equivalentCodes.join(' | '),
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(flexoRows), 'Flexo');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(letterRows), 'Letter');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(tintasRows), 'Tintas');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(compRows), 'Componentes');

  const dateTag = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `AMCOR_Central_Tintas_Formulas_${dateTag}.xlsx`);
}

function findSheetCaseInsensitive(wb: XLSX.WorkBook, candidates: string[]) {
  const map = new Map<string, string>();
  for (const name of wb.SheetNames) {
    map.set(name.trim().toLowerCase(), name);
  }
  for (const cand of candidates) {
    const hit = map.get(cand.toLowerCase());
    if (hit) return wb.Sheets[hit];
  }
  return undefined;
}

function parseNumber(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

export async function importFormulasFromExcel(
  file: File,
  existingLotes: LoteFormula[],
  operatorName: string
): Promise<{
  imported: LoteFormula[];
  skippedDuplicates: string[];
  importedTintasCount: number;
  assortments: AssortmentInk[];
}> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });

  if (wb.SheetNames.length === 0) {
    return { imported: [], skippedDuplicates: [], importedTintasCount: 0, assortments: [] };
  }

  const imported: LoteFormula[] = [];
  const skippedDuplicates: string[] = [];
  let importedTintasCount = 0;
  const assortments: AssortmentInk[] = [];

  const tintasSheet = findSheetCaseInsensitive(wb, ['Tintas', 'Sortimentos', 'Assortments', 'Bases']);
  if (tintasSheet) {
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(tintasSheet);
    for (const row of rows) {
      const code = String(row['CodigoSortimento'] || row['Código'] || row['Codigo'] || '').trim();
      const name = String(row['NomeTinta'] || row['Nome'] || row['Tinta'] || '').trim();
      if (!code && !name) continue;

      assortments.push({
        id: generateId(),
        assortmentCode: code || `AUTO-${Date.now()}`,
        name: name || code,
        supplierName: String(row['Fornecedor'] || ''),
        series: String(row['Serie'] || row['Série'] || ''),
        ciPigment: String(row['CIPigmento'] || row['CI'] || ''),
        role: (String(row['Funcao'] || row['Função'] || 'PIGMENT').toUpperCase() as AssortmentInk['role']) || 'PIGMENT',
        stockKg: parseNumber(row['EstoqueKG'] || row['Estoque'] || 0),
        minStockKg: parseNumber(row['EstoqueMinKG'] || 5),
        estimatedCostPerKgBrl: parseNumber(row['CustoKgBRL'] || row['Custo'] || 0),
        equivalentCodes: String(row['EquivalentesSAP'] || '')
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean),
        lastUpdated: new Date().toISOString(),
      });
      importedTintasCount++;
    }
  }

  const processSheets: { sheet: XLSX.WorkSheet | undefined; process: ProcessType }[] = [
    { sheet: findSheetCaseInsensitive(wb, ['Flexo', 'FLEXO']), process: 'FLEXO' },
    { sheet: findSheetCaseInsensitive(wb, ['Letter', 'LETTER', 'Letterpress']), process: 'LETTER' },
  ];

  const existingNums = new Set(existingLotes.map((l) => l.loteNumber.toUpperCase()));

  for (const { sheet, process } of processSheets) {
    if (!sheet) continue;
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

    for (const row of rows) {
      const loteNum = String(row['Lote'] || row['LoteNumber'] || '').trim();
      if (!loteNum) continue;

      if (existingNums.has(loteNum.toUpperCase())) {
        skippedDuplicates.push(loteNum);
        continue;
      }

      const components: FormulaComponent[] = [];
      const totalGrams = parseNumber(row['TotalGramas'] || row['QTDE'] || row['Qtde'] || 0);

      const lote: LoteFormula = {
        id: generateId(),
        loteNumber: loteNum || generateUniqueLoteNumber([...existingLotes, ...imported]),
        currentVersion: parseNumber(row['Versao'] || row['Versão'] || 1) || 1,
        process,
        colorName: String(row['Cor'] || row['Color'] || ''),
        colorCode: String(row['CodigoCor'] || row['Código Cor'] || ''),
        product: String(row['Produto'] || ''),
        sapCode: String(row['SAP'] || row['CodigoSAP'] || ''),
        machine: String(row['Maquina'] || row['Máquina'] || ''),
        description: String(row['Descricao'] || row['Descrição'] || ''),
        colorRef: {
          hex: String(row['HEX'] || ''),
          pantone: String(row['Pantone'] || ''),
          rgb: String(row['RGB'] || ''),
        },
        components,
        totalGrams,
        createdBy: operatorName,
        createdAt: new Date().toISOString(),
        validity: String(row['Validade'] || ''),
        status: 'ACTIVE',
      };

      imported.push(lote);
      existingNums.add(lote.loteNumber.toUpperCase());
    }
  }

  const compSheet = findSheetCaseInsensitive(wb, ['Componentes', 'Components', 'Itens']);
  if (compSheet) {
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(compSheet);
    const byLote = new Map<string, FormulaComponent[]>();

    for (const row of rows) {
      const loteNum = String(row['Lote'] || '').trim();
      if (!loteNum) continue;

      const comp: FormulaComponent = {
        codeSap: String(row['CodigoSAP'] || row['Código SAP'] || ''),
        name: String(row['Componente'] || row['Nome'] || ''),
        percentage: parseNumber(row['Percentual'] || row['%'] || 0),
        grams: parseNumber(row['Gramas'] || 0) || undefined,
        supplier: String(row['Fornecedor'] || ''),
        expiryDate: String(row['Validade'] || ''),
      };

      if (!byLote.has(loteNum)) byLote.set(loteNum, []);
      byLote.get(loteNum)!.push(comp);
    }

    for (const lote of imported) {
      const comps = byLote.get(lote.loteNumber);
      if (comps) {
        lote.components = comps;
        if (!lote.totalGrams && comps.some((c) => c.grams)) {
          lote.totalGrams = comps.reduce((s, c) => s + (c.grams || 0), 0);
        }
      }
    }
  }

  return { imported, skippedDuplicates, importedTintasCount, assortments };
}

export function exportAssortmentsToExcel(assortments: AssortmentInk[]): void {
  const rows = assortments.map((b) => ({
    CodigoSortimento: b.assortmentCode,
    NomeTinta: b.name,
    Fornecedor: b.supplierName,
    Serie: b.series,
    CIPigmento: b.ciPigment || '',
    Funcao: b.role,
    EstoqueKG: b.stockKg,
    EstoqueMinKG: b.minStockKg,
    CustoKgBRL: b.estimatedCostPerKgBrl,
    EquivalentesSAP: b.equivalentCodes.join(' | '),
    UltimaAtualizacao: b.lastUpdated,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Tintas');
  XLSX.writeFile(wb, `AMCOR_Sortimentos_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
