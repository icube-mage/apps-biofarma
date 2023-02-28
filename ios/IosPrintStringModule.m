// IosPrintStringModule.m
#import "IosPrintStringModule.h"

@implementation IosPrintStringModule

// To export a module named IosPrintStringModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getMyString:(RCTResponseSenderBlock)callback) {
  static NSString *const myString = @"Hello from native module iOS!";
  callback(@[myString]);
}

@end
