package com.wevertonlink.targetfill;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private TransactionBroadcastReceiver transactionReceiver;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Registrar plugin customizado
        registerPlugin(NotificationListenerPlugin.class);

        // Registrar broadcast receiver para transações
        transactionReceiver = new TransactionBroadcastReceiver(getBridge());
        registerReceiver(transactionReceiver, TransactionBroadcastReceiver.getIntentFilter());

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
