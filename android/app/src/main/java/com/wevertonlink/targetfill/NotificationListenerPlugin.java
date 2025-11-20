package com.wevertonlink.targetfill;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import android.content.Intent;
import android.provider.Settings;

@CapacitorPlugin(name = "NotificationListener")
public class NotificationListenerPlugin extends Plugin {

    @PluginMethod
    public void requestPermission(PluginCall call) {
        // Abre as configurações para o usuário conceder permissão
        Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
        getActivity().startActivity(intent);
        call.resolve();
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
