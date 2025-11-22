package com.wevertonlink.targetfill;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import android.content.Intent;
import android.provider.Settings;
import android.util.Log;

@CapacitorPlugin(name = "NotificationListener")
public class NotificationListenerPlugin extends Plugin {
    private static final String TAG = "NotificationListener";
    private static NotificationListenerPlugin instance;

    // Plugin para gerenciar permissões de acesso a notificações

    @Override
    public void load() {
        super.load();
        instance = this;
        Log.d(TAG, "✅ Plugin carregado, instância salva");
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        try {
            Log.d(TAG, "Solicitando permissão de notificações");

            // Abre as configurações para o usuário conceder permissão
            Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

            // Usa o contexto diretamente (mais confiável em plugins Capacitor)
            getContext().startActivity(intent);
            Log.d(TAG, "Configurações abertas com sucesso via Context");
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "Erro ao abrir configurações: " + e.getMessage());
            call.reject("Erro ao abrir configurações: " + e.getMessage());
        }
    }

    @PluginMethod
    public void checkPermission(PluginCall call) {
        boolean hasPermission = NotificationListener.isEnabled(getContext());
        call.resolve(new com.getcapacitor.JSObject().put("granted", hasPermission));
    }

    @PluginMethod
    public void startListening(PluginCall call) {
        // O serviço já está rodando se a permissão foi concedida
        // Apenas confirma que está ativo
        boolean isActive = NotificationListener.isEnabled(getContext());
        call.resolve(new com.getcapacitor.JSObject().put("active", isActive));
    }

    @PluginMethod
    public void sendTestNotification(PluginCall call) {
        try {
            Log.d(TAG, "🧪 Enviando notificação de teste diretamente...");

            // Envia teste diretamente via método estático
            sendTransactionEvent(100.50, "CREDIT", "Teste", "Nubank (Teste)",
                                "Notificação de teste", "Você recebeu R$ 100,50 de Teste");

            call.resolve(new com.getcapacitor.JSObject().put("success", true));
        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao enviar teste: " + e.getMessage());
            call.reject("Erro ao enviar teste: " + e.getMessage());
        }
    }

    /**
     * Método estático que pode ser chamado do NotificationListener
     * para enviar eventos de transação diretamente para o JavaScript
     */
    public static void sendTransactionEvent(double amount, String type, String category,
                                           String source, String description, String rawText) {
        if (instance == null) {
            Log.e(TAG, "❌ Plugin instance não disponível! App pode não estar aberto.");
            return;
        }

        try {
            Log.d(TAG, "📤 Enviando evento de transação para JavaScript...");

            com.getcapacitor.JSObject data = new com.getcapacitor.JSObject();
            data.put("amount", amount);
            data.put("type", type);
            data.put("category", category);
            data.put("source", source);
            data.put("description", description != null ? description : "");
            data.put("rawText", rawText);

            Log.d(TAG, "💰 Transação: R$ " + amount + " - " + type + " de " + source);
            Log.d(TAG, "🚀 Disparando evento JavaScript: " + data.toString());

            instance.getBridge().triggerWindowJSEvent("transactionDetected", data.toString());

            Log.d(TAG, "✅ Evento JavaScript disparado com sucesso!");
        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao enviar evento: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void getServiceStatus(PluginCall call) {
        try {
            boolean isEnabled = NotificationListener.isEnabled(getContext());

            // Pega a lista de listeners habilitados
            String enabledListeners = android.provider.Settings.Secure.getString(
                getContext().getContentResolver(),
                "enabled_notification_listeners"
            );

            com.getcapacitor.JSObject result = new com.getcapacitor.JSObject();
            result.put("enabled", isEnabled);
            result.put("enabledListeners", enabledListeners != null ? enabledListeners : "");

            Log.d(TAG, "📊 Status do serviço - Enabled: " + isEnabled);
            Log.d(TAG, "📊 Listeners habilitados: " + enabledListeners);

            call.resolve(result);
        } catch (Exception e) {
            call.reject("Erro ao verificar status: " + e.getMessage());
        }
    }
}
