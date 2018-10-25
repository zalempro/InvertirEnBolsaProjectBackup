#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n com.invertirenbolsa.iebapp/host.exp.exponent.MainActivity
