#include <emscripten/bind.h>
#include <string>
#include <vector>
#include <map>
#include <regex>
#include <algorithm>

using namespace emscripten;

struct PermissionRisk {
    std::string name;
    int score;
};

class APKAnalyzer {
public:
    // Extract permissions from AndroidManifest.xml binary
    std::vector<std::string> extractPermissions(const std::string& manifestData) {
        std::vector<std::string> perms;
        std::regex permRegex("android\\.permission\\.([A-Z_]+)");
        std::sregex_iterator iter(manifestData.begin(), manifestData.end(), permRegex);
        std::sregex_iterator end;
        for (; iter != end; ++iter) {
            perms.push_back("android.permission." + iter->str(1));
        }
        // Remove duplicates
        std::sort(perms.begin(), perms.end());
        perms.erase(std::unique(perms.begin(), perms.end()), perms.end());
        return perms;
    }

    // Extract suspicious strings from DEX
    std::vector<std::string> extractSuspicious(const std::string& dexData) {
        std::vector<std::string> strings;
        std::regex urlRegex("(https?://[\\w\\.-]+/[\\w\\./?%&=~-]*)");
        std::regex apiRegex("(api\\.[\\w\\.-]+)");
        std::regex secretRegex("(secret|token|password|key|auth|c2|cmd|shell)");

        std::sregex_iterator urlIter(dexData.begin(), dexData.end(), urlRegex);
        std::sregex_iterator end;
        for (; urlIter != end; ++urlIter) strings.push_back(urlIter->str());

        std::sregex_iterator apiIter(dexData.begin(), dexData.end(), apiRegex);
        for (; apiIter != end; ++apiIter) strings.push_back(apiIter->str());

        std::sort(strings.begin(), strings.end());
        strings.erase(std::unique(strings.begin(), strings.end()), strings.end());
        return strings;
    }

    // Calculate risk score
    int calculateRisk(const std::vector<std::string>& permissions, const std::vector<std::string>& suspicious, int nativeLibCount) {
        int score = 0;
        std::vector<std::string> highRisk = {"READ_CONTACTS", "RECORD_AUDIO", "CAMERA", "ACCESS_FINE_LOCATION", "READ_SMS", "SEND_SMS", "CALL_PHONE", "READ_PHONE_STATE"};
        std::vector<std::string> midRisk = {"WRITE_EXTERNAL_STORAGE", "ACCESS_COARSE_LOCATION", "GET_ACCOUNTS"};

        for (const auto& p : permissions) {
            bool isHigh = false, isMid = false;
            for (const auto& h : highRisk) if (p.find(h) != std::string::npos) { isHigh = true; break; }
            for (const auto& m : midRisk) if (p.find(m) != std::string::npos) { isMid = true; break; }
            if (isHigh) score += 12;
            else if (isMid) score += 6;
            else score += 2;
        }
        score += suspicious.size() * 5;
        score += nativeLibCount * 3;
        return std::min(score, 100);
    }

    // Parse package name from manifest
    std::string extractPackage(const std::string& manifestData) {
        std::regex pkgRegex("package="([^"]+)"");
        std::smatch match;
        if (std::regex_search(manifestData, match, pkgRegex)) return match[1];
        return "unknown";
    }

    // Extract version
    std::string extractVersion(const std::string& manifestData) {
        std::regex verRegex("android:versionName="([^"]+)"");
        std::smatch match;
        if (std::regex_search(manifestData, match, verRegex)) return match[1];
        return "1.0";
    }
};

EMSCRIPTEN_BINDINGS(apk_analyzer) {
    class_<APKAnalyzer>("APKAnalyzer")
        .constructor<>()
        .function("extractPermissions", &APKAnalyzer::extractPermissions)
        .function("extractSuspicious", &APKAnalyzer::extractSuspicious)
        .function("calculateRisk", &APKAnalyzer::calculateRisk)
        .function("extractPackage", &APKAnalyzer::extractPackage)
        .function("extractVersion", &APKAnalyzer::extractVersion);

    register_vector<std::string>("VectorString");
}
