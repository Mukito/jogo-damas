## 📱 Passo a Passo para Rodar no VSCode e Criar App para Celular
### PARTE 1: Configurar e Rodar no VSCode
#### 1. Instalar Node.js

    * Baixe e instale o Node.js: https://nodejs.org/ 
    * Escolha a versão LTS (recomendada) 
    * Verifique a instalação abrindo o terminal e digitando:
        ```bash
        node --version
        npm --version
        
        ```

#### 2. Criar o Projeto React
Abra o terminal (cmd, PowerShell ou terminal do VSCode) e execute:

```bash
npx create-react-app jogo-damas
cd jogo-damas

```

#### 3. Instalar Dependências
```
npm install lucide-react
```
#### 4. Adicionar Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

```

#### 5. Configurar Tailwind
Abra o arquivo `tailwind.config.js` e substitua o conteúdo por:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 6. Configurar CSS do Tailwind
Abra `src/index.css` e substitua todo o conteúdo por:`
```css 
@tailwind base;
@tailwind components;
@tailwind utilities;

```

#### 7. Criar o Componente do Jogo
Substitua todo o conteúdo do arquivo `src/App.js` pelo código do jogo (o código completo que está no artifact).

#### 8. Rodar o Projeto
```bash
npm start

```

O navegador abrirá automaticamente em http://localhost:3000 com o jogo rodando! 🎮

## PARTE 2: Criar Executável para Celular Android
Para criar um app Android real, você precisa usar **React Native** ou **Capacitor**. Vou te mostrar a opção mais simples com Capacitor:
### 1. Instalar Capacitor
No terminal, dentro da pasta do projeto:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

Quando perguntar:

* **App name**: Jogo de Damas
* **App ID**: com.seunome.jogodamas (use seu nome/empresa)
* **Web directory**: build

### 2. Instalar Plugin Android

```bash
npm install @capacitor/android
```

### 3. Build do Projeto React
```bash
npm run build
```

### 4. Adicionar Plataforma Android
```bash
npx cap add android
```

### 5. Sincronizar
```bash
npx cap sync
```

### 6. Abrir no Android Studio
```bash
npx cap open android
```

Isso abrirá o Android Studio (você precisa tê-lo instalado: https://developer.android.com/studio)

### 7. Gerar APK no Android Studio

* No Android Studio, vá em: **Build** > **Build Bundle(s)** / **APK(s)** > **Build APK(s)**
* Aguarde o build terminar
* Clique em "locate" para encontrar o APK
* Transfira o APK para seu celular e instale!

--------------------------------------------------------

## OPÇÃO MAIS SIMPLES: PWA (Progressive Web App)

Se quiser algo mais rápido sem precisar do Android Studio:

### 1. Fazer o Build
```bash
npm run build

```

### 2. Hospedar Online
Você pode hospedar gratuitamente em:

* **Netlify**: https://netlify.com
* **Vercel**: https://vercel.com
* **GitHub Pages**: https://pages.github.com

**Exemplo com Netlify**:

* Arraste a pasta build para https://app.netlify.com/drop
* Pronto! Você terá um link que pode acessar do celular

**3. Adicionar à Tela Inicial**
No celular:

* Abra o link no Chrome/Safari
* Toque no menu (3 pontos)
* Selecione "Adicionar à tela inicial"
* O jogo ficará como um app no seu celular! 📱

-----------------------------------------

Qual opção escolher?

🟢 Mais Fácil: PWA (hospedar online e adicionar à tela inicial)
🟡 Intermediário: Capacitor (cria APK real, mas precisa Android Studio)
🔴 Mais Completo: React Native (precisa reescrever o código)

**Recomendo começar com PWA** - é rápido, funciona bem e não precisa de instalação complexa!
Precisa de ajuda em algum passo específico? 😊