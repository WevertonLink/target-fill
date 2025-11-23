package com.wevertonlink.targetfill;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;
import android.content.Intent;
import android.provider.Settings;
import android.util.Log;

@CapacitorPlugin(name = "NotificationListener")
public class NotificationListenerPlugin extends Plugin {
    private static final String TAG = "NotificationListener";
    private static NotificationListenerPlugin instance;

    @Override
    public void load() {
        super.load();
        instance = this;
        Log.d(TAG, "✅ Plugin carregado e instância salva");

        // Processa transações pendentes do banco de dados
        processPendingTransactions();
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        try {
            Log.d(TAG, "📱 Abrindo configurações de notificação...");
            Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            getContext().startActivity(intent);
            Log.d(TAG, "✅ Configurações abertas");
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao abrir configurações: " + e.getMessage());
            call.reject("Erro ao abrir configurações: " + e.getMessage());
        }
    }

    @PluginMethod
    public void checkPermission(PluginCall call) {
        boolean hasPermission = NotificationListener.isEnabled(getContext());
        JSObject result = new JSObject();
        result.put("granted", hasPermission);
        Log.d(TAG, "🔍 Permissão verificada: " + hasPermission);
        call.resolve(result);
    }

    @PluginMethod
    public void startListening(PluginCall call) {
        boolean isActive = NotificationListener.isEnabled(getContext());
        JSObject result = new JSObject();
        result.put("active", isActive);
        Log.d(TAG, "🎧 Listening status: " + isActive);
        call.resolve(result);
    }

    @PluginMethod
    public void sendTestNotification(PluginCall call) {
        try {
            Log.d(TAG, "🧪 Teste iniciado...");
            
            // Verifica se o serviço está habilitado
            if (!NotificationListener.isEnabled(getContext())) {
                Log.e(TAG, "❌ Serviço não habilitado! Ative nas configurações.");
                call.reject("Serviço não habilitado. Ative o Target-Fill nas configurações de notificação.");
                return;
            }
            
            sendTransactionEvent(100.50, "CREDIT", "Teste", "Nubank (Teste)",
                                "Notificação de teste", "Você recebeu R$ 100,50 de Teste");
            
            JSObject result = new JSObject();
            result.put("success", true);
            Log.d(TAG, "✅ Teste enviado com sucesso");
            call.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "❌ Erro no teste: " + e.getMessage(), e);
            call.reject("Erro ao enviar teste: " + e.getMessage());
        }
    }

    /**
     * Envia evento de transação para JavaScript via notifyListeners (padrão Capacitor)
     * @return true se enviado com sucesso, false se o plugin não está disponível
     */
    public static boolean sendTransactionEvent(double amount, String type, String category,
                                              String source, String description, String rawText) {
        if (instance == null) {
            Log.e(TAG, "❌ Plugin instance é null! App pode não estar aberto.");
            return false;
        }

        try {
            Log.d(TAG, "📤 Preparando envio de transação...");

            JSObject data = new JSObject();
            data.put("amount", amount);
            data.put("type", type);
            data.put("category", category);
            data.put("source", source);
            data.put("description", description != null ? description : "");
            data.put("rawText", rawText);
            data.put("timestamp", System.currentTimeMillis());

            Log.d(TAG, "💰 Transação: R$ " + amount + " - " + type + " de " + source);
            Log.d(TAG, "🚀 Dados: " + data.toString());

            // Usa notifyListeners (padrão correto do Capacitor)
            instance.notifyListeners("transactionDetected", data);

            Log.d(TAG, "✅ Evento enviado via notifyListeners!");
            return true;
        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao enviar evento: " + e.getMessage(), e);
            return false;
        }
    }

    /**
     * Processa transações pendentes do banco de dados quando o app abre
     */
    private void processPendingTransactions() {
        try {
            AppDatabase db = AppDatabase.getInstance(getContext());
            java.util.List<Transaction> pending = db.transactionDao().getUnprocessedTransactions();

            if (pending.isEmpty()) {
                Log.d(TAG, "📭 Nenhuma transação pendente");
                return;
            }

            Log.d(TAG, "📬 Processando " + pending.size() + " transação(ões) pendente(s)...");

            java.util.List<Integer> processedIds = new java.util.ArrayList<>();

            for (Transaction t : pending) {
                if (sendTransactionEvent(t.amount, t.type, t.category, t.source,
                                        t.description, t.rawText)) {
                    processedIds.add(t.id);
                    Log.d(TAG, "✅ Transação " + t.id + " processada");
                }
            }

            if (!processedIds.isEmpty()) {
                int[] idsArray = processedIds.stream().mapToInt(i -> i).toArray();
                db.transactionDao().markAsProcessed(idsArray);
                Log.d(TAG, "✅ " + processedIds.size() + " transação(ões) marcada(s) como processada(s)");
            }

            // Limpa transações processadas com mais de 7 dias
            long weekAgo = System.currentTimeMillis() - (7L * 24 * 60 * 60 * 1000);
            db.transactionDao().deleteOldProcessed(weekAgo);

        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao processar transações pendentes: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void getServiceStatus(PluginCall call) {
        try {
            boolean isEnabled = NotificationListener.isEnabled(getContext());
            String enabledListeners = Settings.Secure.getString(
                getContext().getContentResolver(),
                "enabled_notification_listeners"
            );

            JSObject result = new JSObject();
            result.put("enabled", isEnabled);
            result.put("enabledListeners", enabledListeners != null ? enabledListeners : "");

            Log.d(TAG, "📊 Service Status:");
            Log.d(TAG, "  - Enabled: " + isEnabled);
            Log.d(TAG, "  - Listeners: " + enabledListeners);

            call.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao verificar status: " + e.getMessage());
            call.reject("Erro: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getPendingTransactionsCount(PluginCall call) {
        try {
            AppDatabase db = AppDatabase.getInstance(getContext());
            int count = db.transactionDao().getUnprocessedCount();

            JSObject result = new JSObject();
            result.put("count", count);

            Log.d(TAG, "📊 Transações pendentes: " + count);
            call.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao contar transações: " + e.getMessage());
            call.reject("Erro: " + e.getMessage());
        }
    }

    @PluginMethod
    public void processNow(PluginCall call) {
        try {
            Log.d(TAG, "🔄 Processando transações manualmente...");
            processPendingTransactions();
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao processar: " + e.getMessage());
            call.reject("Erro: " + e.getMessage());
        }
    }
}
