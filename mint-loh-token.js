const xrpl = require('xrpl');

async function addLOHMetadata() {
    console.log("🎨 LOH 토큰 메타데이터 등록 시작...");
    
    // XRPL 클라이언트 연결
    const client = new xrpl.Client('wss://s1.ripple.com');
    await client.connect();
    console.log("✅ XRPL 네트워크 연결 완료");

    try {
        // 발행자 지갑 설정
        const issuerWallet = xrpl.Wallet.fromMnemonic("absurd resemble denial garlic color scatter drama evidence gallery mystery ostrich lens");
        console.log("📊 발행자 주소:", issuerWallet.classicAddress);

        // LOH 토큰 공식 웹사이트 및 메타데이터
        const officialWebsite = "https://yesoklab.github.io/loh-website/";
        const ipfsHash = "bafybeiaf7cyifz54wrrlbqgb5q3temizwmfn5p6heugi7sowdwqrw7dr6q";
        const metadataUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
        
        console.log("🏛️ LOH 공식 웹사이트:", officialWebsite);
        console.log("🖼️ 메타데이터 URL:", metadataUrl);

        // AccountSet 트랜잭션으로 도메인 설정
        console.log("📝 토큰 메타데이터 등록 중...");
        
        // 도메인을 16진수로 변환 (공식 웹사이트 등록)
        const domainHex = Buffer.from(officialWebsite).toString('hex').toUpperCase();
        
        const accountSet = {
            TransactionType: "AccountSet",
            Account: issuerWallet.classicAddress,
            Domain: domainHex
        };

        const result = await client.submitAndWait(accountSet, {
            wallet: issuerWallet
        });

        if (result.result.meta.TransactionResult === "tesSUCCESS") {
            console.log("🎉 LOH 토큰 메타데이터 등록 성공!");
            console.log("📊 트랜잭션 해시:", result.result.hash);
            console.log("🏛️ 이재명 대통령 1시간 = 국민 51,169,148명");
            console.log("💎 LOH 토큰 발행량: 51,169,045개");
            console.log("🔗 공식 웹사이트:", officialWebsite);
            console.log("🐦 트위터:", "https://x.com/YesOkLab");
            console.log("📱 텔레그램:", "https://t.me/YesOkLab_NFT");
            console.log("🔗 IPFS 메타데이터:", metadataUrl);
            
            // 계정 정보 확인
            const accountInfo = await client.request({
                command: "account_info",
                account: issuerWallet.classicAddress
            });
            
            if (accountInfo.result.account_data.Domain) {
                const decodedDomain = Buffer.from(accountInfo.result.account_data.Domain, 'hex').toString();
                console.log("✅ 등록된 도메인:", decodedDomain);
            }
            
        } else {
            console.log("❌ 메타데이터 등록 실패:", result.result.meta.TransactionResult);
        }

        // 추가: NFT 스타일 메타데이터 생성 (선택사항)
        console.log("\n🏷️ LOH 토큰 표준 메타데이터:");
        const tokenMetadata = {
            name: "LOH Token",
            symbol: "LOH",
            description: "LOH는 '대한민국 제21대 이(L)재명 대통령의 (1hour) 1시간은 대한민국 국민의 수 51,169,148명과 같다는 상징적인 의미를 담고 있습니다.",
            image: metadataUrl,
            decimals: 6,
            totalSupply: "51169045",
            issuer: issuerWallet.classicAddress,
            website: officialWebsite,
            meaning: "이재명 대통령의 1시간 = 대한민국 국민 51,169,148명",
            president: "이재명 (제21대 대통령)",
            social: {
                website: "https://yesoklab.github.io/loh-website/",
                twitter: "https://x.com/YesOkLab",
                telegram: "https://t.me/YesOkLab_NFT",
                developer: "YesOkLab"
            },
            attributes: [
                {
                    trait_type: "Token Type",
                    value: "Presidential Commemorative Token"
                },
                {
                    trait_type: "President",
                    value: "이재명 (21st President)"
                },
                {
                    trait_type: "Korean Population",
                    value: "51,169,148명"
                },
                {
                    trait_type: "Network",
                    value: "XRP Ledger"
                },
                {
                    trait_type: "Launch Date",
                    value: "2025-07-18"
                }
            ]
        };
        
        console.log(JSON.stringify(tokenMetadata, null, 2));

    } catch (error) {
        console.error("❌ 오류 발생:", error);
    } finally {
        await client.disconnect();
        console.log("🔌 XRPL 네트워크 연결 종료");
    }
}

// 메타데이터 등록 실행
addLOHMetadata().catch(console.error);
