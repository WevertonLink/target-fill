# 📱 Como Instalar o Novo APK

## ⚠️ IMPORTANTE: Package ID Mudou!

O package ID do app foi alterado:
- **Antigo:** `com.targetfill.app`
- **Novo:** `com.wevertonlink.targetfill`

Para o Android, são apps **completamente diferentes**!

---

## 🔧 Passo a Passo para Instalar

### **PASSO 1: Desinstalar o App Antigo** ⚠️

**ANTES de instalar o novo APK, você PRECISA desinstalar o app antigo!**

**No celular:**
1. Vá em **Configurações** → **Apps**
2. Procure **"Target Fill"** ou **"Target-Fill"**
3. Toque no app
4. Clique em **"Desinstalar"**

ou

1. Mantenha pressionado o ícone do app
2. Arraste para **"Desinstalar"**

### **PASSO 2: Gerar Novo APK**

**Opção A - Via Gradle (Terminal):**
```bash
cd android
./gradlew assembleRelease
```
O APK estará em:
`android/app/build/outputs/apk/release/app-release-unsigned.apk`

**Opção B - Via Android Studio:**
1. Abrir projeto: `npx cap open android`
2. Build → Generate Signed Bundle/APK
3. Selecione APK
4. Escolha "release"
5. Build

### **PASSO 3: Transferir e Instalar**

**Via cabo USB:**
```bash
# Copiar APK para celular
adb push android/app/build/outputs/apk/release/app-release-unsigned.apk /sdcard/Download/

# Ou instalar diretamente
adb install android/app/build/outputs/apk/release/app-release-unsigned.apk
```

**Via compartilhamento:**
1. Localize o APK no PC
2. Envie para o celular (WhatsApp, Telegram, Drive, etc.)
3. Abra o arquivo no celular
4. Permita instalação de fontes desconhecidas (se necessário)
5. Instale

---

## ✅ Verificações Pós-Instalação

Após instalar, verifique:
- [ ] Ícone do app aparece corretamente
- [ ] Status bar é preta (não sobrepõe)
- [ ] App abre normalmente
- [ ] Suas metas antigas NÃO estarão lá (é um app novo!)

---

## 💾 Como Manter Seus Dados

Como o package ID mudou, seus dados do app antigo não serão transferidos automaticamente.

**Para não perder suas metas:**

### Antes de desinstalar:
1. Anote suas metas manualmente
2. Ou tire screenshots

### Depois de instalar o novo:
1. Recrie as metas manualmente

**Alternativa avançada** (requer root ou backup):
- Fazer backup do localStorage do app antigo
- Restaurar no app novo
- (Complexo, não recomendado)

---

## 🐛 Troubleshooting

### "App não instala"
- Certifique-se que desinstalou o antigo primeiro
- Verifique se permite instalar de fontes desconhecidas
- Tente reiniciar o celular

### "Ícone não aparece"
- Desinstale completamente
- Limpe cache: Configurações → Apps → Launcher → Limpar cache
- Reinstale

### "Status bar ainda sobrepõe"
- Verifique se é realmente o APK novo (versão 2.3.0)
- Verifique o package: `com.wevertonlink.targetfill`
- Tente limpar dados do app

---

## 📊 Informações do APK Novo

- **Package ID:** com.wevertonlink.targetfill
- **Versão:** 2.3.0 (versionCode: 3)
- **Status Bar:** Configurada (preta)
- **Ícones:** Todos os tamanhos mipmap
- **Tamanho:** ~500KB (estimado)

---

## 🚀 GitHub Actions (Futuro)

Quando você fizer push para o repositório, o GitHub Actions irá:
1. Buildar automaticamente
2. Gerar APK com as configurações corretas
3. Disponibilizar para download

Você pode baixar direto de lá, sem precisar buildar localmente!

---

✨ **Boa instalação!**
