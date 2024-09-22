#!/bin/bash

# Navigate to android folder
cd android

# Clean the project
./gradlew clean

# Build the debug APK
./gradlew assembleDebug

# Navigate back to the root folder
cd ..

# Uninstall the current app from the connected device
adb uninstall com.meditation.bliss

# Install the newly built APK
adb install android/app/build/outputs/apk/debug/app-debug.apk
