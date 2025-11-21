package com.targetfill.notificationlistener;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.webkit.WebView;
import android.os.Bundle;
import android.app.Notification;

public class NotificationListener extends NotificationListenerService {
    
    private static NotificationListener instance;
    
    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
    }
    
    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();
        
        // Filtrar apenas bancos
        if (packageName.contains("nubank") || 
            packageName.contains("inter") || 
            packageName.contains("c6bank") ||
            packageName.contains("mercadopago")) {
            
            Bundle extras = sbn.getNotification().extras;
            String title = extras.getString(Notification.EXTRA_TITLE);
            String text = extras.getCharSequence(Notification.EXTRA_TEXT).toString();
            
            // Enviar para WebView via JavaScript
            sendToWebView(packageName, title, text);
        }
    }
    
    private void sendToWebView(String packageName, String title, String text) {
        // Escapar aspas
        title = title.replace("\"", "\\\"");
        text = text.replace("\"", "\\\"");
        
        String js = String.format(
            "window.dispatchEvent(new CustomEvent('bankNotification', { detail: { packageName: '%s', title: '%s', text: '%s' } }))",
            packageName, title, text
        );
        
        // TODO: Injetar no WebView principal
        System.out.println("Notificação detectada: " + js);
    }
    
    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        // Não precisa fazer nada
    }
}
