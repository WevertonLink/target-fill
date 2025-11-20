# 🔔 Detecção Automática de Notificações Bancárias

Sistema que detecta transações bancárias via notificações do Android e atualiza suas metas automaticamente.

## 🎯 Como Funciona

1. **Escuta notificações** de apps bancários brasileiros
2. **Extrai valores** e tipo de transação (PIX, compra, depósito, etc)
3. **Mostra modal** para você confirmar ou aplicar regras automáticas
4. **Atualiza a meta** selecionada automaticamente

## 📱 Configuração Inicial

### Passo 1: Conceder Permissão

1. Abra o Target-Fill
2. Toque no **menu** (☰) no canto superior direito
3. Role até **"Notificações Bancárias"**
4. Toque em **"Ativar Detecção Automática"**
5. O Android abrirá as configurações
6. Encontre **"Target-Fill"** na lista
7. **Ative** o acesso às notificações
8. Volte ao app

✅ **Pronto!** O sistema já está escutando suas notificações.

### Passo 2: Criar Regras Automáticas (Opcional)

Regras automáticas eliminam a necessidade de confirmar manualmente cada transação.

**Exemplo de regras úteis:**

#### Freelancer/Autônomo
```
Banco: Nubank
Tipo: Recebimentos (PIX, TED, etc)
Meta: Faturamento do Mês
```
→ Todo PIX recebido no Nubank vai direto para "Faturamento do Mês"

#### Controle de Gastos
```
Banco: Todos os bancos
Tipo: Gastos
Filtro: "iFood"
Meta: Alimentação
```
→ Compras no iFood vão direto para meta "Alimentação"

#### Caixinhas do Banco
```
Banco: Inter
Tipo: Depósitos em caixinhas
Filtro: "Casamento"
Meta: Casamento
```
→ Depósitos na caixinha "Casamento" do Inter espelham no Target-Fill

## 🏦 Bancos Suportados

- ✅ Nubank
- ✅ Inter
- ✅ C6 Bank
- ✅ Bradesco
- ✅ Banco do Brasil
- ✅ Itaú
- ✅ Santander
- ✅ Caixa
- ✅ Neon
- ✅ PicPay
- ✅ Next
- ✅ Will Bank
- ✅ Banco Original

## 📊 Tipos de Transação Detectados

### 💰 Recebimentos (CREDIT)
- PIX recebido
- TED/DOC recebido
- Depósito
- Entrada de dinheiro

### 🛒 Gastos (DEBIT)
- Compras no cartão
- PIX enviado
- Pagamentos
- Débitos

### 🏦 Poupança (SAVINGS)
- Depósitos em caixinhas
- Valores guardados
- Reservas

### 📈 Rendimentos (INVESTMENT)
- Rendimento de investimentos
- Lucro de aplicações

## ⚙️ Como Criar uma Regra Automática

1. Menu (☰) → **"Gerenciar Regras"**
2. Toque em **"Nova Regra"**
3. Configure:
   - **Banco**: Qual banco aplicar (ou "Todos")
   - **Tipo**: Recebimentos, Gastos, etc
   - **Filtro**: Palavra-chave opcional (ex: "Salário", "iFood")
   - **Meta**: Para qual meta enviar
4. Toque em **"Adicionar"**

### 💡 Dica: Criar Regra no Modal

Quando uma transação é detectada, você pode marcar a opção **"Criar regra automática"** antes de confirmar. Isso cria a regra automaticamente!

## 🔧 Gerenciar Regras

No menu **"Gerenciar Regras"** você pode:

- ✅ **Ativar/Desativar** regras (botão toggle)
- 🗑️ **Remover** regras que não usa mais
- ➕ **Adicionar** novas regras

## 🎬 Exemplos de Uso Real

### Caso 1: Freelancer
```
Objetivo: Rastrear faturamento mensal

Meta criada: "Faturamento Outubro" - R$ 5.000

Regra:
- Banco: Nubank
- Tipo: Recebimentos
- Meta: Faturamento Outubro

Resultado:
✓ Cliente pagou R$ 1.500 via PIX
✓ Target-Fill detecta e adiciona automaticamente
✓ Progresso: R$ 1.500 / R$ 5.000 (30%)
```

### Caso 2: Controle de Alimentação
```
Objetivo: Não gastar mais que R$ 600/mês com comida

Meta criada: "Alimentação Outubro" - R$ 600

Regra:
- Banco: Todos
- Tipo: Gastos
- Filtro: "iFood"
- Meta: Alimentação Outubro

Resultado:
✓ Pediu iFood de R$ 45
✓ Target-Fill adiciona automaticamente
✓ Progresso: R$ 245 / R$ 600 (41%)
✓ Alerta quando passar de R$ 600
```

### Caso 3: Espelhar Caixinha do Banco
```
Objetivo: Sincronizar caixinha do banco com Target-Fill

Meta criada: "Viagem 2025" - R$ 3.000

Regra:
- Banco: Inter
- Tipo: Depósitos em caixinhas
- Filtro: "Viagem"
- Meta: Viagem 2025

Resultado:
✓ Depositou R$ 200 na caixinha "Viagem" do Inter
✓ Target-Fill detecta e espelha automaticamente
✓ Ambos ficam sincronizados!
```

## ❓ Perguntas Frequentes

### Por que preciso conceder permissão de notificações?

O Android protege notificações de outros apps. Para ler notificações bancárias, você precisa conceder essa permissão especial manualmente.

### O Target-Fill envia minhas notificações para algum servidor?

**NÃO!** Tudo é processado localmente no seu celular. Zero dados saem do dispositivo.

### E se eu limpar as notificações antes do Target-Fill ler?

Sem problemas! O Target-Fill lê a notificação no momento que ela aparece. Limpar depois não afeta.

### Funciona com o app fechado?

Sim! O serviço de escuta roda em background. Mesmo com o app fechado, transações são detectadas.

### Posso desativar temporariamente?

Sim! Vá em Configurações do Android → Notificações → Acesso a notificações → Desative o Target-Fill.

### E se meu banco não estiver na lista?

O sistema tenta detectar mesmo assim! Se não funcionar, me avise o nome do banco para eu adicionar suporte.

## 🐛 Solução de Problemas

### Notificações não estão sendo detectadas

1. ✅ Verifique se a permissão está ativa:
   - Configurações → Notificações → Acesso a notificações → Target-Fill **ON**

2. ✅ Teste fazendo uma transação pequena (R$ 0,01 via PIX para você mesmo)

3. ✅ Verifique se o banco está enviando notificações:
   - Faça uma transação
   - Veja se a notificação aparece na barra de notificações

4. ✅ Reinicie o app após conceder permissão

### Modal não aparece quando deveria

1. Verifique se você tem **regras automáticas** ativas para aquele tipo de transação
2. Se tiver regra, não aparece modal (adiciona direto)
3. Para ver o modal, desative temporariamente a regra

### Valor detectado está errado

O parser usa regex para extrair valores. Se o formato da notificação do banco for muito diferente, pode falhar. Me envie a notificação exata para eu ajustar!

## 🔒 Privacidade e Segurança

- ✅ **100% offline** - Nada sai do seu celular
- ✅ **Código aberto** - Você pode auditar o código
- ✅ **Sem analytics** - Zero rastreamento
- ✅ **Sem internet** - Funciona completamente offline
- ✅ **Dados locais** - Tudo no localStorage do navegador

## 🚀 Próximas Melhorias

Possíveis features futuras (me diga se quer alguma!):

- [ ] Suporte a mais bancos
- [ ] Detecção de categoria por merchant (ex: "Mercado" se comprou no Carrefour)
- [ ] Estatísticas de gastos por categoria
- [ ] Exportar histórico de transações
- [ ] Backup automático das regras

---

**Dúvidas?** Abra uma issue no GitHub ou me contate!
