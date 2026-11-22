# Amcor InkScale · Central de Tintas

Sistema web (PWA) + Android para formulação de tintas, pesagem com balança PRIX (serial/Bluetooth), controle de estoque de sortimentos (bases/pigmentos em KG), Pantone LIVE e autenticação Firebase (Google + Microsoft corporativo).

## Instalação no PC via Chrome (PWA)

1. Faça o build e publique (GitHub Pages, Netlify, Vercel ou servidor interno).
2. Abra o site no **Google Chrome** (desktop ou notebook).
3. Clique no ícone de **instalar** (⊕) na barra de endereço ou em Menu → Instalar InkScale.
4. O app abre em janela própria, como aplicativo nativo, e funciona offline (cache básico).

Também funciona no Edge e Chrome Android (Adicionar à tela inicial).

## Versão Android (Capacitor)

```bash
# 1. Instale dependências
npm install

# 2. Build da versão web
npm run build

# 3. Adicione a plataforma Android (só na primeira vez)
npx cap add android

# 4. Sincronize
npx cap sync android

# 5. Abra no Android Studio
npx cap open android
```

No Android Studio: Build → Build Bundle(s) / APK(s) → Generate Signed Bundle / APK.

Requisitos: Android Studio, JDK 17+, variáveis ANDROID_HOME configuradas.

## Desenvolvimento local

```bash
cp .env.example .env   # preencha as chaves Firebase
npm install
npm run dev
```

Acesse http://localhost:5173

### Variáveis de ambiente (.env)

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_MICROSOFT_TENANT_ID=common   # ou o ID do tenant corporativo
```

## Funcionalidades principais

- Login Google / Microsoft (conta corporativa libera OneDrive/SharePoint)
- Roles: ADMIN · COLORISTA · OPERADOR · VIEWER
- Import/Export Excel (abas Flexo, Letter, Tintas/Sortimentos)
- Cadastro e controle de estoque de bases/pigmentos em KG (dedução automática na formulação)
- Modo pesagem mobile paisagem + teclado numérico + F1–F4
- Configuração e calibração de balança PRIX (Web Serial + Web Bluetooth)
- Pantone LIVE (modo gratuito ou conta corporativa) com LED de status
- Identidade visual Amcor (logo + cores oficiais)

## Estrutura

```
src/
  components/     # AmcorLogo, LoginPage, ...
  context/        # AuthContext (Firebase + mock dev)
  types/ink.ts    # ScaleConfig, PantoneLive, AssortmentInk, LoteFormula...
  utils/          # excelHelper (Flexo/Letter/Tintas)
  firebaseConfig.ts
public/
  manifest.webmanifest
  sw.js           # Service Worker PWA
  icons/
```

## Publicação rápida (GitHub Pages)

1. No repositório, vá em Settings → Pages → Source: GitHub Actions ou branch `gh-pages`.
2. Ou use `npm run build` e publique a pasta `dist/`.

---

Amcor · InkScale · 2026
