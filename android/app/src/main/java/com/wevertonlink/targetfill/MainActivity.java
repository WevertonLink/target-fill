package com.wevertonlink.targetfill;

import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private TransactionBroadcastReceiver transactionReceiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // IMPORTANTE: registrar plugin ANTES de super.onCreate()
        registerPlugin(NotificationListenerPlugin.class);

        super.onCreate(savedInstanceState);

        Log.d("MainActivity", "✅ NotificationListenerPlugin registrado");

        // Registrar broadcast receiver para transações
        transactionReceiver = new TransactionBroadcastReceiver(getBridge());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Log.d("MainActivity", "📡 Registrando receiver (Android 13+, NOT_EXPORTED)");
            registerReceiver(transactionReceiver, TransactionBroadcastReceiver.getIntentFilter(), Context.RECEIVER_NOT_EXPORTED);
        } else {
            Log.d("MainActivity", "📡 Registrando receiver (Android < 13)");
            registerReceiver(transactionReceiver, TransactionBroadcastReceiver.getIntentFilter());
        }
        Log.d("MainActivity", "✅ TransactionBroadcastReceiver registrado!");

        // Configurar status bar
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(android.graphics.Color.BLACK);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (transactionReceiver != null) {
            unregisterReceiver(transactionReceiver);
        }
    }
}
