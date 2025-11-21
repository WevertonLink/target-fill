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
    // Plugin para gerenciar permissões de acesso a notificações

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
}
