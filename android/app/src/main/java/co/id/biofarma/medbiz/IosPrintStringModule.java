package co.id.biofarma.medbiz; // replace com.your-app-name with your app’s name
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class IosPrintStringModule extends ReactContextBaseJavaModule {
    IosPrintStringModule(ReactApplicationContext context) {
        super(context);
    }

    // MANDATORY
    @Override
    public String getName() {
        return "IosPrintStringModule";
    }

    @ReactMethod
    public void getMyString(Callback callback) {
        String token = "Hello from native module Android!";
        callback.invoke(token);
    }
}