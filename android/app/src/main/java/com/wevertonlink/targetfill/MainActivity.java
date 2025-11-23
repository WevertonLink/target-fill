package com.wevertonlink.targetfill;

import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(NotificationListenerPlugin.class);
        super.onCreate(savedInstanceState);
        Log.d("MainActivity", "✅ NotificationListenerPlugin registrado");
        
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(android.graphics.Color.BLACK);
        }
    }
}
