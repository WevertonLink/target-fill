package com.wevertonlink.targetfill;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.text.TextUtils;
import android.util.Log;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class NotificationListener extends NotificationListenerService {
    private static final String TAG = "NotificationListener";

    // Apps bancários brasileiros
    private static final String[] BANK_PACKAGES = {
        "com.nu.production",           // Nubank
        "com.mercadopago.wallet",      // Mercado Pago
        "br.com.intermedium",          // Inter
        "br.com.c6bank.app",           // C6 Bank
        "com.bradesco",                // Bradesco
        "br.com.bb.android",           // Banco do Brasil
        "com.itau",                    // Itaú
        "com.santander.app",           // Santander
        "br.com.original.bank",        // Banco Original
        "com.caixa",                   // Caixa
        "br.com.neon",                 // Neon
        "com.picpay",                  // PicPay
        "br.com.next",                 // Next
        "br.com.will.app"              // Will Bank
    };

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();

        // Verifica se é de um banco
        if (!isBankApp(packageName)) {
            return;
        }

        // Extrai informações da notificação
        String title = "";
        String text = "";

        if (sbn.getNotification().extras != null) {
            CharSequence titleSeq = sbn.getNotification().extras.getCharSequence("android.title");
            CharSequence textSeq = sbn.getNotification().extras.getCharSequence("android.text");

            if (titleSeq != null) title = titleSeq.toString();
            if (textSeq != null) text = textSeq.toString();
        }

        String fullText = title + " " + text;
        Log.d(TAG, "Notificação bancária: " + fullText);

        // Parse da notificação
        TransactionData transaction = parseNotification(fullText, packageName);

        if (transaction != null) {
            Log.d(TAG, "Transação detectada: " + transaction.toString());
            sendTransactionToApp(transaction);
        }
    }

    private boolean isBankApp(String packageName) {
        for (String bankPackage : BANK_PACKAGES) {
            if (packageName.equals(bankPackage)) {
                return true;
            }
        }
        return false;
    }

    private TransactionData parseNotification(String text, String packageName) {
        TransactionData data = new TransactionData();
        data.source = getBankName(packageName);
        data.rawText = text;

        // Regex para detectar valores em reais
        // Padrões: R$ 150,00 | R$ 150 | 150,00 | R$150,00
        Pattern valuePattern = Pattern.compile("R\\$?\\s?(\\d{1,3}(?:\\.\\d{3})*(?:,\\d{2})?)", Pattern.CASE_INSENSITIVE);
        Matcher valueMatcher = valuePattern.matcher(text);

        if (valueMatcher.find()) {
            String valueStr = valueMatcher.group(1);
            // Remove pontos de milhar e substitui vírgula por ponto
            valueStr = valueStr.replace(".", "").replace(",", ".");
            try {
                data.amount = Double.parseDouble(valueStr);
            } catch (NumberFormatException e) {
                Log.e(TAG, "Erro ao parsear valor: " + valueStr);
                return null;
            }
        } else {
            return null; // Sem valor = não é transação
        }

        // Detecta tipo de transação
        String lowerText = text.toLowerCase();

        if (lowerText.contains("pix recebido") || lowerText.contains("recebeu") ||
            lowerText.contains("você recebeu") || lowerText.contains("entrada")) {
            data.type = "CREDIT";
            data.category = "Receita";
        } else if (lowerText.contains("pix enviado") || lowerText.contains("pagamento") ||
                   lowerText.contains("compra") || lowerText.contains("débito") ||
                   lowerText.contains("gastou") || lowerText.contains("saída")) {
            data.type = "DEBIT";
            data.category = detectCategory(lowerText);
        } else if (lowerText.contains("depositou") || lowerText.contains("caixinha") ||
                   lowerText.contains("guardou") || lowerText.contains("reservou")) {
            data.type = "SAVINGS";
            data.category = extractSavingsCategory(text);
        } else if (lowerText.contains("rendimento") || lowerText.contains("rendeu")) {
            data.type = "INVESTMENT";
            data.category = "Rendimento";
        } else {
            data.type = "OTHER";
        }

        // Extrai nome do remetente/destinatário se for PIX
        if (lowerText.contains("pix")) {
            Pattern namePattern = Pattern.compile("(?:de|para)\\s+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-záàâãéêíóôõúç]+(?:\\s+[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-záàâãéêíóôõúç]+)*)");
            Matcher nameMatcher = namePattern.matcher(text);
            if (nameMatcher.find()) {
                data.description = nameMatcher.group(1);
            }
        }

        return data;
    }

    private String detectCategory(String text) {
        if (text.contains("ifood") || text.contains("restaurante") ||
            text.contains("uber eats") || text.contains("rappi")) {
            return "Alimentação";
        } else if (text.contains("uber") || text.contains("99") ||
                   text.contains("transporte")) {
            return "Transporte";
        } else if (text.contains("netflix") || text.contains("spotify") ||
                   text.contains("amazon prime")) {
            return "Assinaturas";
        } else if (text.contains("mercado") || text.contains("supermercado")) {
            return "Mercado";
        }
        return "Geral";
    }

    private String extractSavingsCategory(String text) {
        // Tenta extrair o nome da caixinha
        // Ex: "Você depositou R$ 500 na caixinha Casamento"
        Pattern pattern = Pattern.compile("(?:caixinha|guardadinho|reserva)\\s+([\\wÀ-ÿ]+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "Poupança";
    }

    private String getBankName(String packageName) {
        switch (packageName) {
            case "com.nu.production": return "Nubank";
            case "com.mercadopago.wallet": return "Mercado Pago";
            case "br.com.intermedium": return "Inter";
            case "br.com.c6bank.app": return "C6 Bank";
            case "com.bradesco": return "Bradesco";
            case "br.com.bb.android": return "Banco do Brasil";
            case "com.itau": return "Itaú";
            case "com.santander.app": return "Santander";
            case "br.com.original.bank": return "Original";
            case "com.caixa": return "Caixa";
            case "br.com.neon": return "Neon";
            case "com.picpay": return "PicPay";
            case "br.com.next": return "Next";
            case "br.com.will.app": return "Will Bank";
            default: return "Banco";
        }
    }

    private void sendTransactionToApp(TransactionData transaction) {
        // Envia broadcast para o app
        Intent intent = new Intent("com.wevertonlink.targetfill.TRANSACTION_DETECTED");
        intent.putExtra("amount", transaction.amount);
        intent.putExtra("type", transaction.type);
        intent.putExtra("category", transaction.category);
        intent.putExtra("source", transaction.source);
        intent.putExtra("description", transaction.description);
        intent.putExtra("rawText", transaction.rawText);
        sendBroadcast(intent);
    }

    public static boolean isEnabled(Context context) {
        ComponentName cn = new ComponentName(context, NotificationListener.class);
        String flat = Settings.Secure.getString(context.getContentResolver(), "enabled_notification_listeners");
        return flat != null && flat.contains(cn.flattenToString());
    }

    // Classe interna para dados da transação
    private static class TransactionData {
        double amount;
        String type;        // CREDIT, DEBIT, SAVINGS, INVESTMENT, OTHER
        String category;
        String source;      // Nome do banco
        String description;
        String rawText;

        @Override
        public String toString() {
            return String.format("%s R$ %.2f - %s (%s)", type, amount, category, source);
        }
    }
}
