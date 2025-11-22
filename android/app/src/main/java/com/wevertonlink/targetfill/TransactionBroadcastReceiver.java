package com.wevertonlink.targetfill;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;
import com.getcapacitor.Bridge;
import com.getcapacitor.JSObject;

public class TransactionBroadcastReceiver extends BroadcastReceiver {
    private static final String TAG = "TransactionBroadcast";
    private static final String ACTION_TRANSACTION = "com.wevertonlink.targetfill.TRANSACTION_DETECTED";
    private Bridge bridge;

    public TransactionBroadcastReceiver(Bridge bridge) {
        this.bridge = bridge;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "📨 Broadcast recebido!");

        if (ACTION_TRANSACTION.equals(intent.getAction())) {
            Log.d(TAG, "✅ Action correto: TRANSACTION_DETECTED");

            // Extrai dados da transação
            double amount = intent.getDoubleExtra("amount", 0);
            String type = intent.getStringExtra("type");
            String category = intent.getStringExtra("category");
            String source = intent.getStringExtra("source");
            String description = intent.getStringExtra("description");
            String rawText = intent.getStringExtra("rawText");

            Log.d(TAG, String.format("💰 Transação: R$ %.2f - %s de %s", amount, type, source));

            // Envia para o JavaScript
            JSObject data = new JSObject();
            data.put("amount", amount);
            data.put("type", type);
            data.put("category", category);
            data.put("source", source);
            data.put("description", description != null ? description : "");
            data.put("rawText", rawText);

            Log.d(TAG, "🚀 Enviando para JavaScript: " + data.toString());
            bridge.triggerWindowJSEvent("transactionDetected", data.toString());
            Log.d(TAG, "✅ Evento JavaScript disparado!");
        } else {
            Log.d(TAG, "❌ Action incorreto: " + intent.getAction());
        }
    }

    public static IntentFilter getIntentFilter() {
        IntentFilter filter = new IntentFilter();
        filter.addAction(ACTION_TRANSACTION);
        return filter;
    }
}
