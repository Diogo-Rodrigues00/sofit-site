# Site da Academia Sô Fit

Site de apresentação da Sô Fit, em HTML, CSS e JavaScript puros (sem framework).
Os avisos e as campanhas vêm de uma planilha do Google, então a administradora
consegue atualizar sem mexer no código.

## Estrutura

```
sofit-site/
├── index.html              → a página (textos fixos: modalidades, planos, endereço)
├── css/style.css           → visual (cores no topo do arquivo, em :root)
├── js/config.js            → WhatsApp, horários, aulas e ID da planilha  ← o que mais muda
├── js/main.js              → comportamento (status aberto/fechado, abas, planilha)
└── planilha-modelo/        → arquivos para montar a planilha de avisos
    ├── Avisos.csv
    └── Campanha.csv
```

## 1. Ver o site no seu computador

1. Instale o [VS Code](https://code.visualstudio.com/) e a extensão **Live Server**.
2. Abra a pasta `sofit-site` no VS Code.
3. Clique com o botão direito no `index.html` → **Open with Live Server**.

Toda vez que você salvar um arquivo, a página recarrega sozinha.

## 2. O que trocar antes de publicar

No **`js/config.js`**:
- `whatsapp`: 55 + DDD + número, só dígitos (ex.: `5534999998888`).

No **`index.html`**, procure por `[` (colchete) para achar tudo que é provisório:
- `[R$ —]` → preços dos planos
- `[RUA, NÚMERO, BAIRRO]` → endereço
- `[CONFIRMAR]` → plano mínimo do Gympass/TotalPass
- `[FOTO ...]` → fotos (veja abaixo)

### Colocando as fotos

1. Crie uma pasta `img/` e coloque as fotos lá (de preferência `.jpg`, com até ~300 KB cada).
2. Troque cada `<div class="foto">[FOTO]</div>` por:

```html
<img class="foto" src="img/musculacao.jpg" alt="Sala de musculação da Sô Fit" style="object-fit: cover; padding: 0; border: 0;">
```

O `alt` descreve a foto para quem usa leitor de tela e ajuda no Google.

## 3. Planilha de avisos e campanhas

### Montar a planilha (uma vez só)

1. Crie uma planilha nova no Google Planilhas.
2. Em **Arquivo → Configurações**, deixe a localidade como **Brasil** (para as datas ficarem dd/mm/aaaa).
3. Crie duas abas com estes nomes exatos: **Avisos** e **Campanha**.
4. Em cada aba, vá em **Arquivo → Importar → Fazer upload**, escolha o CSV com o mesmo nome
   (pasta `planilha-modelo`) e selecione **Substituir a página atual**.
5. Clique em **Compartilhar → Acesso geral → Qualquer pessoa com o link → Leitor**.
6. Copie o ID da planilha: é o trecho entre `/d/` e `/edit` no link.
   `https://docs.google.com/spreadsheets/d/`**`1AbC...xyz`**`/edit`
7. Cole o ID no `js/config.js`, em `planilhaId: '1AbC...xyz'`.

> Qualquer pessoa com o link consegue ver a planilha, então tudo que estiver nela é público.
> Não coloque dados de alunos nela.

### Como a administradora usa

**Aba Avisos** (cada linha vira um card na seção "Fique ligado"):

| coluna | o que escrever |
|---|---|
| ativo | `sim` para aparecer, `não` para esconder |
| tipo | Aviso, Evento, Novidade… (aparece como etiqueta) |
| titulo | título curto |
| texto | uma ou duas frases |
| data | opcional, aparece no card (ex.: 15/11 às 9h) |
| mostrar_ate | opcional, dd/mm/aaaa: depois desse dia o aviso some sozinho |
| link | opcional, começando com https:// |

**Aba Campanha** (faixa colorida no topo do site, ex.: Novembro Azul):

| coluna | o que escrever |
|---|---|
| ativa | `sim` em **uma** linha (vale a primeira ativa) |
| nome | ex.: Novembro Azul |
| mensagem | frase curta |
| cor | cor em hex, ex.: `#1E5BD8` (azul), `#E8559A` (rosa) |
| link | opcional |
| mostrar_ate | opcional, dd/mm/aaaa |

Sem aviso ativo, a seção some do site. Sem campanha ativa, a faixa some.
Depois de editar, o site pode levar alguns minutos para mostrar a mudança (cache do Google).

Enquanto `planilhaId` estiver vazio, o site mostra os dados de exemplo do `config.js`,
só para você ver como fica.

## 4. Publicar no GitHub Pages (grátis)

1. Crie uma conta no [GitHub](https://github.com) e um repositório novo, público, chamado `sofit-site`
   (sem README, para começar vazio).
2. No terminal (PowerShell ou Git Bash), dentro da pasta `sofit-site`:

```bash
git init
git add .
git commit -m "Primeira versão do site da Sô Fit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/sofit-site.git
git push -u origin main
```

3. No GitHub, abra o repositório → **Settings → Pages** → em *Branch*, escolha `main` e `/ (root)` → **Save**.
4. Em um ou dois minutos o site estará em `https://SEU_USUARIO.github.io/sofit-site/`.

### Atualizando depois

Sempre que mudar algum arquivo:

```bash
git add .
git commit -m "Descreva o que mudou"
git push
```

O que cada comando faz:
- `git add .` → separa as mudanças para salvar
- `git commit -m "..."` → salva uma versão com uma descrição
- `git push` → envia essa versão para o GitHub (e o site atualiza)

### Domínio próprio (opcional)

Dá para usar algo como `academiasofit.com.br`: registre no [Registro.br](https://registro.br)
e configure em **Settings → Pages → Custom domain**.
