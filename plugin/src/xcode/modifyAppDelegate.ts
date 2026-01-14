import fs from "node:fs";

export function modifyAppDelegate(appDelegatePath: string): void {
  let content = fs.readFileSync(appDelegatePath, "utf8");

  // Check if already modified
  if (content.includes("decompressGzipBundle")) {
    console.log("✅ AppDelegate already configured for compression");
    return;
  }

  // Add zlib import at the top
  if (!content.includes("import zlib")) {
    content = content.replace(
      /(import.*\n)+/,
      (imports) => imports + "import zlib\n"
    );
  }

  // Find and replace the bundleURL() function
  const bundleURLPattern =
    /override func bundleURL\(\) -> URL\? \{[\s\S]*?#if DEBUG[\s\S]*?#else[\s\S]*?#endif[\s\S]*?\}/;

  if (bundleURLPattern.test(content)) {
    content = content.replace(
      bundleURLPattern,
      `override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
#else
    return decompressedBundleURL()
#endif
  }

  // MARK: - Bundle Decompression

  private func decompressedBundleURL() -> URL? {
    if let gzPath = Bundle.main.url(forResource: "main.jsbundle", withExtension: "gz") {
      return decompressGzipBundle(at: gzPath)
    }
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  }

  private func decompressGzipBundle(at compressedURL: URL) -> URL? {
    let decompressedPath = NSTemporaryDirectory() + "main.jsbundle"
    let decompressedURL = URL(fileURLWithPath: decompressedPath)

    try? FileManager.default.removeItem(at: decompressedURL)

    do {
      let compressedData = try Data(contentsOf: compressedURL)
      guard let decompressedData = compressedData.gunzipped() else {
        print("❌ Failed to decompress bundle")
        return nil
      }

      try decompressedData.write(to: decompressedURL, options: .atomic)
      print("✅ Decompressed: \\(compressedData.count / 1024) KB → \\(decompressedData.count / 1024) KB")

      return decompressedURL
    } catch {
      print("❌ Error: \\(error)")
      return nil
    }
  }
}

// MARK: - Gzip Extension
extension Data {
  func gunzipped() -> Data? {
    guard !self.isEmpty else { return self }

    var stream = z_stream()
    var decompressed = Data(capacity: self.count * 2)

    let status: CInt = self.withUnsafeBytes { (inputPtr: UnsafeRawBufferPointer) -> CInt in
      stream.avail_in = UInt32(self.count)
      stream.next_in = UnsafeMutablePointer<UInt8>(mutating: inputPtr.bindMemory(to: UInt8.self).baseAddress!)

      guard inflateInit2_(&stream, 15 + 32, ZLIB_VERSION, Int32(MemoryLayout<z_stream>.size)) == Z_OK else {
        return Z_STREAM_ERROR
      }

      var result: CInt = Z_OK
      repeat {
        if Int(stream.total_out) >= decompressed.count {
          decompressed.count += self.count / 2
        }

        let outputCount = decompressed.count
        let totalOut = Int(stream.total_out)

        result = decompressed.withUnsafeMutableBytes { (outputPtr: UnsafeMutableRawBufferPointer) -> CInt in
          stream.avail_out = UInt32(outputCount) - UInt32(totalOut)
          stream.next_out = outputPtr.bindMemory(to: UInt8.self).baseAddress!.advanced(by: totalOut)
          return inflate(&stream, Z_SYNC_FLUSH)
        }
      } while result == Z_OK

      inflateEnd(&stream)
      return result
    }

    guard status == Z_STREAM_END else {
      return nil
    }

    decompressed.count = Int(stream.total_out)
    return decompressed
  }`
    );

    fs.writeFileSync(appDelegatePath, content);
    console.log("✅ Modified AppDelegate for gzip decompression");
  } else {
    console.warn("⚠️ Could not find bundleURL() function in AppDelegate");
  }
}