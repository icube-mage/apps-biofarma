// ClearWebviewCache.m
#import "ClearWebviewCache.h"
#import "WebKit/WKWebsiteDataStore.h"

@implementation ClearWebviewCache : NSObject

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(clearWebviewIOS:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
  
  NSSet *websiteDataTypes = [WKWebsiteDataStore allWebsiteDataTypes];
  NSDate *dateFrom = [NSDate dateWithTimeIntervalSince1970:0];
  dispatch_async(dispatch_get_main_queue(), ^{
    [[WKWebsiteDataStore defaultDataStore] removeDataOfTypes:websiteDataTypes modifiedSince:dateFrom completionHandler:^{
      return resolve(@"ok");
    }];
  });
}

@end
