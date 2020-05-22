import React from 'react';
import HomeHeader from '../../components/HomeHeader'; // Navigation header
import { Modal } from 'react-responsive-modal'; // Login modal
import 'react-responsive-modal/styles.css'; // Login modal css
import AnchorLink from 'react-anchor-link-smooth-scroll'; // Smooth scroll for in-page anchor links
import Dropzone from 'react-dropzone' // Dropzone for uploading keyfile
import { withRouter } from 'react-router-dom'; // Used to access history props to programatically change page
import Fade from 'react-reveal/Fade'; // React-reveal animations
import Image from 'react-graceful-image'; // React graceful image rendering
import './index.css';

// Image imports
import gmail from '../../static/images/gmail.png';
import featureOneImage from '../../static/images/private.png';
import featureTwoImage from '../../static/images/people.png';
import featureThreeImage from '../../static/images/uncensorable.png';
import upload from '../../static/images/upload.png';
import step_one from '../../static/images/steps1.png';
import step_two from '../../static/images/steps2.png';
import step_three from '../../static/images/steps3.png';

class Home extends React.Component {
	constructor() {
		super();

		this.state = {
			modalState: false, // Modal state
			keyFileName: "Drop keyfile here", // Modal dropzone text
			isLoading: false, // Modal loading status
		};
	}

	// Toggle login modal state
	toggleModal = () => {
		// Access previousState, and toggle it
		this.setState(previousState => ({ modalState: !previousState.modalState, keyFileName: "Drop keyfile here", isLoading: false}));
	};

	// Keyfile upload and parsing
	keyFile = file => {
		// If filename ends in '.json'
		if (file[0].name.split('.').pop().toLowerCase() === "json") {
			const upload = file[0]; // Get uploaded file
			let fileName = upload.name.length > 15 ? upload.name.substring(0, 10) + "....json" : upload.name; // Concatenate filename for dropzone

			this.setState({
				keyFileName: fileName,
				isLoading: true, // Set loading to true
			});

			const reader = new FileReader(); // Initiate FileReader
			reader.readAsText(upload); // Read content as text
			reader.onload = () => {
				const keyfile = JSON.parse(reader.result); // Parse text to JSON object


				if (keyfile.kty === "RSA") { // Confirm that uploaded file is indeed keyfile
					sessionStorage.setItem('keyfile', reader.result); // Set keyfile to sessionStorage
					this.toggleModal(); // Close login modal
					window.location.reload(); // Reload page to get authenticated status
				} else {
					// If uploaded JSON is not keyfile
					this.setState({
						// Throw error
						keyFileName: "Error: Not a keyfile",
						isLoading: false
					});
				}
			}
		} else {
			// If filename does not end in '.json'
			this.setState({
				// Throw error
				keyFileName: "Error: Not a keyfile"
			})
		}
	}

	componentDidMount() {
		document.title = 'Weve | Home' // Set head on mount
	}

	render() {
		// List of items collected by gmail (used for mapped rendering)
		const gmailCollects = ['Your name', 'Your password', 'Phone number', 'Payment information', 'Created content', 'Received content',
		'Uploaded content', 'Search terms', 'Viewed emails', 'Interacted ads', 'Frequent contacts', 'Browsing history', 'Audio file information',
		'Purchase activity', 'Browser type', 'Unique identifiers', 'Device type', 'Operating system', 'Mobile network', 'IP Address', 'System activity',
		'Referrer URL', 'Marketing partner info', 'Advertising info', 'GPS location', 'Device sensor data', 'WiFi data', 'Installed apps'];

		return (
			<>
				<Modal 
					open={this.state.modalState} 
					onClose={this.toggleModal}
					center={true}
					showCloseIcon={false}>
					<div className="login-modal">
						<div>
							<h1 className="unselectable">weve.</h1>
							<p>Drop a <span>keyfile</span> to login</p>
						</div>
						<div>
							<Dropzone onDrop={acceptedFiles => this.keyFile(acceptedFiles)}>
								{({getRootProps, getInputProps}) => (
									<section>
										<div {...getRootProps()}>
											<input {...getInputProps()} />
											{this.state.isLoading ? <i className="fa fa-spinner fa-spin"></i> : <img src={upload} alt="Upload" />}
											<p>{this.state.keyFileName}</p>
										</div>
									</section>
								)}
							</Dropzone>
							<h3>OR</h3>
							<a href="https://www.arweave.org/wallet" target="_blank" rel="noopener noreferrer">Get a wallet</a>
						</div>
					</div>
				</Modal>
				<div className="home" id="top">
					<div>
						<span>Built on Arweave. <a href="https://arweave.org" target="_blank" rel="noopener noreferrer">Find out more.</a></span>
					</div>
					<div className="rounder-sizer">
						<HomeHeader loginToggle={this.toggleModal} />
						<div className="sizer">
							<div className="landing">
								<Fade bottom cascade>
									<div>
										<h1>Private mail.<br/>
										<span>Forever.</span></h1>
										<p><span className="highlight">Weve</span> is the first mail network with an <span className="line"><span className="highlight">immutable privacy policy.</span></span></p>
										<p>It can <span className="highlight">never</span> sell your data, read your <span className="line">mail, or be taken down.</span></p>
									</div>
								</Fade>
							</div>
						</div>
					</div>
					<div className="client">
						<Image 
							src={step_three} 
							alt="Weve inbox"
							placeholderColor='transparent' 
						/>
					</div>
					<div>
						<div className="others sizer">
							<h1>Gmail vs. <span>Weve</span></h1>
							<p><img src={gmail} alt="Gmail logo" />'s privacy policy has <span className="line">grown <span className="highlight-red">Over 650%</span> since inception.</span></p>
							<p>Don't just take our word for it. <span className="line">New York Times <a href="https://www.nytimes.com/interactive/2019/07/10/opinion/google-privacy-policy.html" target="_blank" rel="noopener noreferrer">wrote a whole piece on it</a>.</span></p>
							<div>
								<div>
									<h4>What Gmail collects:</h4>
									{gmailCollects.map((item, index) => {
										return <span key={index}>{item}</span>
									})}
								</div>
								<div>
									<h4>What we collect:</h4>
									<h1>Nothing.</h1>
									<p>And, this will <i>never</i> change. Built open-source and on the Arweave permaweb, <strong>we can't collect your info.</strong></p>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className="features sizer" id="features">
							<h1>End-to-end security</h1>
							<p>Weve runs on the Arweave permaweb so messages are <i>encrypted</i> and <i>uncensorable</i>.</p>
							<div className="feature-showcase">
								<FeatureItem image={featureOneImage} header="Know what you sign up for" text="Weve's privacy policy will never change—because it can't." />
								<FeatureItem image={featureTwoImage} header="Contact anyone on permaweb" text="We've lets you send messages to anyone with an Arweave address." />
								<FeatureItem image={featureThreeImage} header="Decentralized &amp; Peer-to-Peer" text="Weve is mail with no middlemen—just you and your recipient." />
							</div>
						</div>
					</div>
					<div>
						<div className="tech sizer" id="quickstart">
							<h1>How do I use Weve?</h1>
							<p>It's a simple <span className="highlight black">3-step process</span>.</p>
							<Usage />
						</div>
					</div>
					<div className="cta">
						<div className="sizer">
							<h1>Ready to get <span>started</span>?</h1>
							<a href="https://www.arweave.org/wallet" target="_blank" rel="noopener noreferrer">Claim your address</a>
							<button onClick={this.toggleModal}>Login to weve</button>
						</div>
					</div>
					<div className="footer">
						<div className="sizer">
							<div>
								<h1 className="unselectable">weve.</h1>
								<span>Built with <span role="img" aria-label="Purple heart">💜</span> in <a href="https://github.com/anish-agnihotri/weve" target="_blank" rel="noopener noreferrer">open-source</a>.</span>
							</div>
							<div>
								<h3>Quick links</h3>
								<ul>
									<li><a href="https://www.arweave.org/" target="_blank" rel="noopener noreferrer">Arweave</a></li>
									<li><a href="https://www.arweave.org/technology#permaweb" target="_blank" rel="noopener noreferrer">Permaweb</a></li>
									<li><a href="https://www.arweave.org/get-involved/community" target="_blank" rel="noopener noreferrer">Community</a></li>
									<li><a href="https://www.arweave.org/mine/learn-more" target="_blank" rel="noopener noreferrer">Mining</a></li>
								</ul>
							</div>
							<div>
								<h3>Navigation</h3>
								<ul>
									<li><AnchorLink href="#top">Home</AnchorLink></li>
									<li><AnchorLink href="#features">Features</AnchorLink></li>
									<li><AnchorLink href="#quickstart">Quickstart</AnchorLink></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

// Individual feature items
class FeatureItem extends React.Component {
	render() {
		return (
			<div className="feature-item">
				<Image src={this.props.image} alt="Feature item" placeholderColor="#fff" />
				<h3>{this.props.header}</h3>
				<p>{this.props.text}</p>
			</div>
		);
	}
}

// Responsive technology/usage vertical image carousel
class Usage extends React.Component {
	constructor() {
		super();

		this.state = {
			number: 0,
			images: [step_one, step_two, step_three]
		}
	}
	resetNumber = () => {
		this.setState({number: 0}); // Render image depending on currently selected element
	}
	componentDidMount() {
		this.resetNumber();
	}
	render() {
		return (
			<div className="usage">
				<div>
					<button onClick={() => this.setState({number: 0})} className={this.state.number === 0 ? "active-usage-item" : null}>
						<div>
							<div>
								<h2>1</h2>
							</div>
						</div>
						<div>
							<h3>Create Arweave Wallet</h3>
							<p>First, create a permaweb wallet.</p>
						</div>
					</button>
					<button onClick={() => this.setState({number: 1})} className={this.state.number === 1 ? "active-usage-item" : null}>
						<div>
							<div>
								<h2>2</h2>
							</div>
						</div>
						<div>
							<h3>Login to weve</h3>
							<p>Use your wallet to sign-in.</p>
						</div>
					</button>
					<button onClick={() => this.setState({number: 2})} className={this.state.number === 2 ? "active-usage-item" : null}>
						<div>
							<div>
								<h2>3</h2>
							</div>
						</div>
						<div>
							<h3>Send messages with weve</h3>
							<p>Use weve to send and receive!</p>
						</div>
					</button>
				</div>
				<div>
					<span><Image src={this.state.images[this.state.number]} className="usage-image" alt={`Step ${this.state.number}`} placeholderColor="#fff" /></span>
				</div>
			</div>
		);
	}
}

export default withRouter(Home);
