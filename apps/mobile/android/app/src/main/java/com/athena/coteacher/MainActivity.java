package com.athena.coteacher;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final int MIC_PERMISSION_REQUEST_CODE = 1001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Pre-emptively request runtime microphone and audio settings permissions at launch
        // so that Agora Web SDK's getUserMedia() can immediately acquire the mic without block.
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                    this,
                    new String[]{
                            Manifest.permission.RECORD_AUDIO,
                            Manifest.permission.MODIFY_AUDIO_SETTINGS
                    },
                    MIC_PERMISSION_REQUEST_CODE
            );
        }

        configureWebViewAudio();
    }

    @Override
    public void onResume() {
        super.onResume();
        configureWebViewAudio();
    }

    private void configureWebViewAudio() {
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            // Allow remote Agora RTC tracks to autoplay smoothly without waiting for tap gestures
            webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
        }
    }
}
