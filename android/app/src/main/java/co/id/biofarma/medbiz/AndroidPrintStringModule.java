package co.id.biofarma.medbiz; // replace com.your-app-name with your app’s name
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AndroidPrintStringModule extends ReactContextBaseJavaModule {
    AndroidPrintStringModule(ReactApplicationContext context) {
        super(context);
    }

    // MANDATORY
    @Override
    public String getName() {
        return "AndroidPrintStringModule";
    }

    @ReactMethod
    public void getMyString(Callback callback) {
        String token = "Hello from native module Android!";
        callback.invoke(token);
    }
}