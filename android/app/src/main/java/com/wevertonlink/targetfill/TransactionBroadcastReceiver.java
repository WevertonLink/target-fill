package com.wevertonlink.targetfill;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import com.getcapacitor.Bridge;
import com.getcapacitor.JSObject;

public class TransactionBroadcastReceiver extends BroadcastReceiver {
    private static final String ACTION_TRANSACTION = "com.wevertonlink.targetfill.TRANSACTION_DETECTED";
    private Bridge bridge;

    public TransactionBroadcastReceiver(Bridge bridge) {
        this.bridge = bridge;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (ACTION_TRANSACTION.equals(intent.getAction())) {
            // Extrai dados da transação
            double amount = intent.getDoubleExtra("amount", 0);
            String type = intent.getStringExtra("type");
            String category = intent.getStringExtra("category");
            String source = intent.getStringExtra("source");
            String description = intent.getStringExtra("description");
            String rawText = intent.getStringExtra("rawText");

            // Envia para o JavaScript
            JSObject data = new JSObject();
            data.put("amount", amount);
            data.put("type", type);
            data.put("category", category);
            data.put("source", source);
            data.put("description", description != null ? description : "");
            data.put("rawText", rawText);

            bridge.triggerWindowJSEvent("transactionDetected", data.toString());
        }
    }

    public static IntentFilter getIntentFilter() {
        IntentFilter filter = new IntentFilter();
        filter.addAction(ACTION_TRANSACTION);
        return filter;
    }
}
