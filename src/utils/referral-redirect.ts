export const REFERRAL_MAPPINGS = [
    {
        // Axiom homepage
        pattern: /^https?:\/\/(www\.)?(axiom\.trade|app\.axiom\.trade)\/?.*$/,
        referralUrl: 'https://axiom.trade/@hound'
    }
];

export function checkForReferralRedirect() {
    const currentUrl = window.location.href;

    // Special case for Photon - only add referral parameter if already verified
    if (currentUrl.includes('photon-sol.tinyastro.io') &&
        !currentUrl.includes('@hound') &&
        document.cookie.includes('verified=true')) {

        console.log('Detected Photon with verification passed, adding referral');

        // Instead of redirecting, try to modify the UI to include your referral
        // This could be adding a referral cookie or other approach specific to Photon
        try {
            // You might add a cookie, localStorage item, or other approach here
            // Example of adding a hidden referral element:
            const refElement = document.createElement('div');
            refElement.id = 'hound-referral';
            refElement.style.display = 'none';
            refElement.dataset.referral = 'hound';
            document.body.appendChild(refElement);

            console.log('Added referral indicator to Photon');
        } catch (err) {
            console.error('Failed to add referral to Photon:', err);
        }

        return; // Skip regular processing for Photon
    }

    // Regular processing for other platforms
    for (const mapping of REFERRAL_MAPPINGS) {
        if (mapping.pattern.test(currentUrl)) {
            console.log(`Redirecting to referral link: ${mapping.referralUrl}`);

            // Only redirect if we're not already on the referral URL
            if (!currentUrl.includes('@hound') && !currentUrl.includes('ref=hound')) {
                window.location.href = mapping.referralUrl;
            }

            break;
        }
    }
}