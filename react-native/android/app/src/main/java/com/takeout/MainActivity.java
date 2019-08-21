package com.takeout;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.modules.core.PermissionListener;
import com.imagepicker.permissions.OnImagePickerPermissionsCallback;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity implements OnImagePickerPermissionsCallback {

    private PermissionListener listener;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        SplashScreen.show(this);


        super.onCreate(savedInstanceState);
    }


    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Takeout";
    }

    @Override
    public void setPermissionListener(PermissionListener listener)
    {
        this.listener = listener;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
    {
        if (listener != null)
        {
            listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
