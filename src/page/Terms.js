import React, {Component} from 'react';
import backbtn from"../images/back-button.png"
import {Link} from "react-router-dom";
import RouteCheck from "../components/routeCheck";

class Terms extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div className="terms-container container-fluid">
                <title>Terms & Condition</title>
                <div className="terms-header" >
                    <Link onClick={()=>this.props.history.go(-1)} to="#" className="terms-back-button">
                        <img src={backbtn} width='24' height='24' />
            </Link>
            <h1>Terms & Condition</h1>
        </div>
                <RouteCheck/>
        <div class=" terms-content">
            <h2 class=" terms-section-title">Agreement To Terms</h2>

            <p class=" terms-text">By Using Zeros Wallet, You Confirm That:</p>
            <ul class=" terms-list">
                <li>(i) You Have Read And Understood These Terms And Conditions.</li>
                <li>(ii) You Agree To Comply With These Terms.</li>
                <li>(iii) You Are Legally Permitted To Use Cryptocurrency Services In Your Jurisdiction.</li>
            </ul>

            <p class=" terms-text">
                If You Do Not Agree With These Terms Or Any Future Modifications, Please Discontinue Using Zeros Wallet Immediately. Zeros Wallet Does Not Provide Financial Or Investment Advice. Our Platform Is A Non-Custodial Decentralized Wallet, Meaning We Do Not Hold Or Control User Funds, Nor Do We Offer Any Guarantees On Digital Asset Transactions. All Decisions Regarding Cryptocurrency Transactions Are Made At Your Own Discretion And Risk.
            </p>

            <h2 class=" terms-section-title">Privacy Policy</h2>

            <p class=" terms-text">
                To Understand How We Handle User Data, Please Review Our Privacy Policy At [Insert Privacy Policy URL]. By Using Zeros Wallet, You Agree That We May Process Your Information In Accordance With Our Privacy Policy.
            </p>

            <p class=" terms-text">
                Zeros Wallet Is Committed To Maintaining User Privacy. We Do Not Collect Or Store Personal Information Such As Private Keys, Seed Phrases, Or Transaction Histories. However, Basic Usage Data May Be Gathered To Improve Functionality. Users Should Be Aware That All Blockchain Transactions Are Publicly Recorded On Their Respective Networks And Cannot Be Erased Or Altered.
            </p>

            <h2 class=" terms-section-title">Updates to Terms of Service</h2>

            <p class=" terms-text">
                Zeros Wallet reserves the right to modify, revise, or update these Terms at any time, at our sole discretion. Any changes we make will be communicated through one or more of the following channels:
            </p>

            <ul class=" terms-list">
                <li>A notice on our official website,</li>
                <li>Notifications within the Zeros Wallet app, or</li>
                <li>Other official communication channels we may deem appropriate.</li>
            </ul>

            <p class=" terms-text">
                Unless stated otherwise, modifications take effect immediately upon publication. It is your responsibility to review these Terms periodically to remain informed of any updates. Your continued use of Zeros Wallet following any modifications will constitute your acceptance of the updated Terms. If you do not agree with any changes, you must immediately discontinue using our services.
            </p>

            <p class=" terms-text">
                As part of our commitment to innovation and user security, Zeros Wallet may introduce new features, enhance existing ones, or discontinue certain services without prior notice. We are not responsible for any disruptions, losses, or inconveniences that may arise due to these changes. However, we will strive to ensure that any updates benefit our users while maintaining security, efficiency, and compliance with applicable regulations.
            </p>

            <p class=" terms-text">
                By using Zeros Wallet, you acknowledge that these Terms are subject to change, and you agree to stay informed and comply with any modifications.
            </p>

            <h2 class=" terms-section-title">Eligibility</h2>

            <p class=" terms-text">
                Zeros Wallet is available to users in almost all countries where internet access is available. However, users must comply with their local laws regarding cryptocurrency usage. By using Zeros Wallet, you confirm that:
            </p>

            <ul class=" terms-list">
                <li>You are at least 18 years old or of legal age in your jurisdiction.</li>
                <li>You have the legal capacity to use cryptocurrency wallets.</li>
                <li>You are not located in a jurisdiction where using cryptocurrency wallets is illegal.</li>
            </ul>

            <h2 class=" terms-section-title">Non-Custodial Nature</h2>

            <p class=" terms-text">
                Zeros Wallet is a non-custodial wallet, meaning:
            </p>

            <ul class=" terms-list">
                <li>Users control their private keys and funds.</li>
                <li>Zeros Wallet does not store or have access to private keys, seed phrases, or user funds.</li>
                <li>Users are solely responsible for securing their wallet credentials.</li>
            </ul>

            <h2 class=" terms-section-title">Wallet Services</h2>

            <p class=" terms-text">
                Zeros Wallet offers a <span class=" terms-span-bold">secure and decentralized</span> platform for managing digital assets. Our services include:
            </p>

            <ul class=" terms-list">
                <li><span class=" terms-span-bold">Secure storage</span> and management of supported cryptocurrencies.</li>
                <li><span class=" terms-span-bold">Sending and receiving</span> Ethereum-based tokens (ERC-20) and TRC-20 tokens.</li>
                <li><span class=" terms-span-bold">Generating and managing</span> wallet addresses with full user control over private keys.</li>
                <li><span class=" terms-span-bold">Future expansion</span> to support additional blockchain networks.</li>
            </ul>

            <p class=" terms-text">
                Zeros Wallet is a <span class=" terms-span-bold">non-custodial wallet</span> and does <span class="
                       terms-span-bold">not</span> offer DApps integration, staking, or third-party exchange services. Users are solely responsible for their assets and transaction activities.
            </p>

            <h2 class=" terms-section-title">Wallet Address, Private Key, and Backup</h2>

            <p class=" terms-text">
                Zeros Wallet is a <span class="
                       terms-span-bold">non-custodial</span> wallet, meaning you have full control over your <span class="
                       terms-span-bold">private key</span> and <span class="
                       terms-span-bold">wallet address</span>. It is your sole responsibility to securely store your <span class="
                       terms-span-bold">Secret Phrase</span> and <span class=" terms-span-bold">private key</span>.
            </p>

            <ul class=" terms-list">
                <li>We <span class=" terms-span-bold">do not store or recover</span> your private key, Secret Phrase, or wallet password.</li>
                <li>If you lose access to your private key or backup phrase, you will <span class=" terms-span-bold">permanently</span> lose access to your funds.</li>
                <li>Always <span class=" terms-span-bold">back up your wallet</span> securely to prevent loss of Digital Assets.</li>
            </ul>

            <p class=" terms-text">
                Zeros Wallet is not liable for any loss due to forgotten credentials, unauthorized access, or user negligence. Your security is your responsibility.
            </p>

            <h2 class=" terms-section-title">Digital Asset Transactions</h2>

            <p class=" terms-text">
                Zeros Wallet enables users to send and receive digital assets, but all transactions occur on <span class="
                       terms-span-bold">decentralized blockchain networks</span>, not within our control.
            </p>

            <p class=" terms-text">
                By using Zeros Wallet, you acknowledge that:
            </p>

            <ul class=" terms-list">
                <li>Transactions are <span class=" terms-span-bold">irreversible</span>—we cannot modify or cancel them.</li>
                <li>Blockchain networks may <span class=" terms-span-bold">delay, fail, or reject</span> transactions.</li>
                <li>Zeros Wallet <span class="
                       terms-span-bold">does not store or process</span> digital assets; all transactions happen <span class="
                       terms-span-bold">directly on the blockchain</span>.</li>
                <li>We <span class=" terms-span-bold">do not guarantee ownership transfers</span>—title and rights depend on the blockchain protocol.</li>
            </ul>

            <h2 class=" terms-section-title">User Responsibility</h2>

            <p class=" terms-text">
                You are solely responsible for <span class="
                       terms-span-bold">providing accurate transaction details</span>. Zeros Wallet is <span class="
                       terms-span-bold">not liable for errors, lost funds, or incorrect addresses</span>. Always <span class="
                       terms-span-bold">double-check your transaction details</span> before confirming any transfer.
            </p>

            <h2 class=" terms-section-title">Wallet Registration & Security</h2>

            <p class=" terms-text">
                To use Zeros Wallet, you must <span class="
                       terms-span-bold">import an existing wallet</span> or <span class="
                       terms-span-bold">create a new one</span>, generating a <span class="
                       terms-span-bold">private key</span> unique to you. You are <span class=" terms-span-bold">fully responsible</span> for securing your private key and Secret Phrase.
            </p>

            <p class=" terms-text">
                For maximum security, we recommend:
            </p>

            <ul class=" terms-list">
                <li>Using a <span class=" terms-span-bold">strong, unique password</span>.</li>
                <li><span class=" terms-span-bold">Never storing</span> your private key or Secret Phrase online.</li>
                <li>Protecting your devices from <span class=" terms-span-bold">unauthorized access and malware</span>.</li>
                <li><span class=" terms-span-bold">Restricting access</span> to your wallet.</li>
                <li><span class=" terms-span-bold">Acting immediately</span> if you suspect a security breach.</li>
            </ul>

            <p class=" terms-text">
                Zeros Wallet <span class=" terms-span-bold">does not store your private keys</span> and is <span class="
                       terms-span-bold">not liable for any unauthorized access or loss</span> due to user negligence.
            </p>

            <h2 class=" terms-section-title">Push Notifications</h2>

            <p class=" terms-text">
                Zeros Wallet provides <span class="
                       terms-span-bold">push notifications</span> for transaction updates and network congestion alerts. You can <span class="
                       terms-span-bold">enable or disable</span> notifications anytime in the settings menu.
            </p>

            <h2 class=" terms-section-title">Payments & Fees</h2>

            <p class=" terms-text">
                Zeros Wallet does not set or control transaction fees. <span class=" terms-span-bold">Network fees (gas fees), withdrawal fees, and service charges</span> are determined by third-party blockchain networks and service providers. These fees may vary based on network congestion and provider policies.
            </p>

            <p class=" terms-text">
                Zeros Wallet <span class="
                       terms-span-bold">does not charge hidden fees</span> but may receive a <span class="
                       terms-span-bold">revenue share</span> from certain third-party transaction costs. Any fee adjustments will be reflected in the app or on our official website.
            </p>

            <p class=" terms-text">
                Users are responsible for checking and understanding applicable fees before making transactions. Fees from third-party services are <span class="
                       terms-span-bold">not controlled by Zeros Wallet</span>, and we hold <span class="
                       terms-span-bold">no liability</span> for changes or additional charges applied by external providers.
            </p>

            <h2 class=" terms-section-title">Transaction Fees</h2>

            <p class=" terms-text">
                Zeros Wallet applies <span class="
                       terms-span-bold">a minimal transaction fee</span> for processing transfers. Additionally, blockchain networks may impose <span class="
                       terms-span-bold">gas fees</span> or other network charges, which vary based on network congestion and protocol rules.
            </p>

            <p class=" terms-text">
                Before initiating a transaction, ensure your wallet has <span class="
                       terms-span-bold">enough balance</span> to cover both Zeros Wallet fees and network fees. <span class="
                       terms-span-bold">Incorrectly set fees</span> or insufficient funds may result in transaction failure, for which Zeros Wallet holds <span class="
                       terms-span-bold">no liability</span>.
            </p>

            <p class=" terms-text">
                As a <span class=" terms-span-bold">non-custodial wallet</span>, Zeros Wallet does not control, process, or reverse transactions. Users are solely responsible for reviewing and confirming all transaction details before proceeding.
            </p>

            <h2 class=" terms-section-title">Your Use of Zeros Wallet</h2>

            <p class=" terms-text">
                By using Zeros Wallet, you agree to comply with <span class="
                       terms-span-bold">all applicable laws</span> and refrain from any <span class=" terms-span-bold">illegal activities</span>, including fraud, money laundering, or unauthorized access.
            </p>

            <p class=" terms-text">You must <span class=" terms-span-bold">not</span>:</p>
            <ul class=" terms-list">
                <li>Engage in activities that harm, disrupt, or interfere with other users.</li>
                <li>Impersonate others or access wallets without permission.</li>
                <li>Distribute malware, viruses, or harmful code.</li>
                <li>Overload or attempt to bypass security measures.</li>
                <li>Violate the privacy, intellectual property, or rights of others.</li>
            </ul>

            <p class=" terms-text">
                Zeros Wallet reserves the right to <span class="
                       terms-span-bold">restrict access</span> or take necessary actions if you violate these terms. Your use of the service is at your own discretion, and we <span class="
                       terms-span-bold">do not take responsibility</span> for any user-generated content.
            </p>

            <h2 class=" terms-section-title">Limitation of Liability & Disclaimer</h2>

            <p class=" terms-text">
                Zeros Wallet is <span class=" terms-span-bold">not responsible</span> for:
            </p>
            <ul class=" terms-list">
                <li><span class=" terms-span-bold">Transaction delays or failures</span> due to network issues.</li>
                <li><span class=" terms-span-bold">Hardware, software, or internet failures</span> affecting transactions.</li>
                <li><span class=" terms-span-bold">Unauthorized access</span> to your wallet or private information.</li>
                <li><span class=" terms-span-bold">Malicious software or security vulnerabilities</span> in blockchain networks.</li>
            </ul>

            <p class=" terms-text">
                You accept full responsibility for any losses due to <span class="
                       terms-span-bold">forgotten passwords, incorrect transactions, data loss, or third-party attacks</span> like phishing or hacking. Zeros Wallet does not guarantee third-party content, and all risks from external services are solely <span class="
                       terms-span-bold">your responsibility</span>.
            </p>

            <h2 class=" terms-section-title">Indemnity Shield</h2>

            <p class=" terms-text">
                By using Zeros Wallet, you agree to stand by us, protecting Zeros Wallet, its crew, allies, and ecosystem from any storms of claims, losses, liabilities, or costs (including legal battles). This applies if:
            </p>

            <ul class=" terms-list">
                <li>(a) You navigate Zeros Wallet in ways that spark disputes;</li>
                <li>(b) You share feedback or ideas that lead to unintended ripples;</li>
                <li>(c) You step on third-party rights or cross digital boundaries;</li>
                <li>(d) You break these Terms, knowingly or unknowingly; or</li>
                <li>(e) Laws, rules, or regulations get tangled in your actions.</li>
            </ul>

            <p class=" terms-text">
                Zeros Wallet moves forward with innovation—your responsible use helps keep the journey smooth.
            </p>

            <h2 class=" terms-section-title">Termination & Continuity</h2>

            <p class=" terms-text">
                If your journey with Zeros Wallet ends, your responsibilities under this Agreement don't. Your access to your funds stays in your hands—secured by your backup, wallet address, and private key. Zeros Wallet steps back, but your control remains.
            </p>

            <h2 class=" terms-section-title">Entire Agreement</h2>

            <p class=" terms-text">
                This Agreement is the full picture—replacing all past talks, deals, or understandings. Any changes? They need to be in writing and agreed upon by both sides.
            </p>

            <h2 class=" terms-section-title">Notices</h2>

            <p class=" terms-text">
                Updates, changes, or important info? We'll post them in the app or send them electronically. By using Zeros Wallet, you're on board with receiving all communications this way.
            </p>

            <h2 class=" terms-section-title">Need Help?</h2>

            <p class=" terms-text">
                Questions, thoughts, or just want to say hi? Reach out at support@zeroswallet.com. We're here for you!
            </p>
        </div>
    </div>
        );
    }
}

export default Terms;