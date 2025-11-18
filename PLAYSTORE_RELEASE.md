# Guia de Publicação na Play Store - Target-Fill

## 📋 Pré-requisitos

### 1. Conta Google Play Console
- [ ] Criar conta de desenvolvedor ($25 taxa única)
- [ ] Aceitar termos de serviço

### 2. Informações do App

**Nome do App:** Target-Fill - Controle de Metas
**Nome curto:** Target-Fill
**Categoria:** Finanças > Finanças Pessoais
**Classificação de Conteúdo:** Livre (PEGI 3)

**Descrição Curta (80 chars):**
```
Organize suas metas financeiras de forma simples e visual
```

**Descrição Completa:**
```
🎯 Target-Fill - Conquiste Suas Metas Financeiras

Organize e acompanhe suas metas financeiras de forma simples, visual e 100% offline!

✨ RECURSOS PRINCIPAIS:

💰 CONTROLE TOTAL
• Crie metas financeiras ilimitadas
• Dedique valores quando quiser
• Acompanhe o progresso em tempo real

📊 VISUAL E INTUITIVO
• Interface moderna e elegante
• Modo Grid (2 colunas) ou Lista
• Barras de progresso animadas
• Adicione fotos às suas metas

🎯 ORGANIZAÇÃO INTELIGENTE
• Ordenação por progresso, prazo ou valor
• Categorias personalizadas
• Prazos e lembretes visuais
• Oculte metas concluídas

🔒 100% PRIVADO E OFFLINE
• Todos os dados ficam no seu dispositivo
• Sem login ou cadastro
• Sem anúncios
• Sem rastreamento

📱 FUNCIONA EM QUALQUER LUGAR
• Não precisa de internet
• Dados salvos localmente
• Sem sincronização obrigatória

🎨 RECURSOS EXTRAS
• Temas escuro (padrão)
• Hub de boas-vindas interativo
• Histórico de valores dedicados
• Sistema de toasts para feedback

IDEAL PARA:
• Juntar dinheiro para compras
• Economizar para viagens
• Controlar parcelamentos
• Acompanhar investimentos
• Gerenciar objetivos financeiros

💡 GRÁTIS E SEM ANÚNCIOS
Target-Fill é 100% gratuito, sem anúncios e de código aberto!

📝 PRIVACIDADE
Seus dados são seus. Não coletamos, não compartilhamos, não vendemos.

---

Desenvolvido com ❤️ para ajudar você a conquistar seus objetivos!
```

**Tags/Keywords:**
```
metas financeiras, economizar, controle financeiro, objetivos, savings, budget, finance, money goals, economia, juntar dinheiro
```

## 🎨 Assets Necessários

### Ícones
- [x] 72x72px
- [x] 96x96px
- [x] 128x128px
- [x] 144x144px
- [x] 152x152px
- [x] 192x192px
- [x] 384x384px
- [x] 512x512px (feature graphic)

### Screenshots (mínimo 2, máximo 8)
Tamanhos:
- Telefone: 1080x1920 ou 1080x2340
- Tablet 7": 1024x600
- Tablet 10": 1280x800

**Screenshots sugeridos:**
1. Tela inicial (Hub de boas-vindas)
2. Vista em Grid com metas
3. Detalhes de uma meta
4. Modal de dedicar valor
5. Vista em Lista
6. Menu de ordenação

### Feature Graphic
- Tamanho: 1024x500px
- Formato: PNG ou JPG
- Sem transparência

### Vídeo Promocional (Opcional)
- YouTube (30s - 2min)

## 🔧 Build do Projeto

### Opção 1: PWA/WebApp (Recomendado)

```bash
# 1. Build de produção
npm run build

# 2. Testar build
npm run preview

# 3. Deploy (Netlify, Vercel, GitHub Pages, etc.)
# O usuário instala via navegador
```

### Opção 2: APK/AAB com Capacitor

```bash
# 1. Instalar Capacitor (se ainda não tiver)
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# 2. Inicializar Capacitor
npx cap init

# 3. Build web
npm run build

# 4. Adicionar plataforma Android
npx cap add android

# 5. Sincronizar
npx cap sync

# 6. Abrir no Android Studio
npx cap open android

# 7. No Android Studio:
# Build → Generate Signed Bundle/APK → Android App Bundle (.aab)
```

## 📝 Checklist de Publicação

### Preparação
- [x] Código finalizado e testado
- [x] Versão incrementada (2.3.0)
- [x] Manifest.json atualizado
- [x] Ícones em todos os tamanhos
- [x] Política de Privacidade
- [ ] Screenshots capturados
- [ ] Feature graphic criado
- [ ] Build gerado (AAB)

### Play Console
- [ ] App criado no console
- [ ] Informações preenchidas
- [ ] Screenshots uploaded
- [ ] Feature graphic uploaded
- [ ] Ícone uploaded
- [ ] Categoria selecionada
- [ ] Classificação de conteúdo
- [ ] Política de privacidade (URL ou texto)
- [ ] AAB/APK uploaded

### Testes
- [ ] Testar instalação
- [ ] Testar todas as funcionalidades
- [ ] Testar em diferentes resoluções
- [ ] Verificar performance
- [ ] Testar offline

### Lançamento
- [ ] Revisar tudo
- [ ] Enviar para revisão
- [ ] Aguardar aprovação (1-7 dias)
- [ ] Publicar!

## 🚀 Comandos Úteis

```bash
# Build de produção otimizado
npm run build

# Preview do build
npm run preview

# Atualizar versão
npm version patch  # 2.3.0 -> 2.3.1
npm version minor  # 2.3.0 -> 2.4.0
npm version major  # 2.3.0 -> 3.0.0
```

## 📊 Informações Técnicas

**Versão:** 2.3.0
**Versão mínima Android:** 5.0 (API 21)
**Versão target Android:** 14 (API 34)
**Tamanho do APK:** ~500KB (estimado)
**Permissões:** Armazenamento local

## 🔗 Links Úteis

- [Google Play Console](https://play.google.com/console)
- [Política de Desenvolvedores](https://play.google.com/about/developer-content-policy/)
- [Guia de Assets](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)
- [Capacitor Docs](https://capacitorjs.com/docs/android)

## 📧 Contato de Suporte

Email de suporte: [seu-email@example.com]
Site: https://github.com/WevertonLink/target-fill

---

**Boa sorte com a publicação! 🚀**
