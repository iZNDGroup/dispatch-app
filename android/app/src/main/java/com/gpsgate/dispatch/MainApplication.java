package com.gpsgate.dispatch;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.terrylinla.rnsketchcanvas.SketchCanvasPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.airbnb.android.react.maps.MapsPackage;
// CHANGEME: Push notifications
// import com.evollu.react.fcm.FIRMessagingPackage;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import im.shimo.react.cookie.CookieManagerPackage;
import com.rnfs.RNFSPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.RNFetchBlob.RNFetchBlobPackage;  
import com.fileopener.FileOpenerPackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.imagepicker.ImagePickerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new VectorIconsPackage(),
            new RNDeviceInfo(),
            new RNI18nPackage(),
            new MapsPackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
            // CHANGEME: Push notifications
            // new FIRMessagingPackage(),
            new ReactNativeDialogsPackage(),
            new CookieManagerPackage(),
            new RNFSPackage(),
            new FileOpenerPackage(),
            new PhotoViewPackage(),
            new SketchCanvasPackage() 
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
