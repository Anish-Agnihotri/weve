import React from 'react';
import TextLoop from "react-text-loop"; // Text loop for main header
import HomeHeader from '../../components/HomeHeader'; // Navigation header
import { Modal } from 'react-responsive-modal'; // Login modal
import 'react-responsive-modal/styles.css'; // Login modal css
import AnchorLink from 'react-anchor-link-smooth-scroll'; // Smooth scroll for in-page anchor links
import Dropzone from 'react-dropzone' // Dropzone for uploading keyfile
import { withRouter } from 'react-router-dom'; // Used to access history props to programatically change page
import './index.css';

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
											{this.state.isLoading ? <i className="fa fa-spinner fa-spin"></i> : <img src="https://pspfqlx3qgd7.arweave.net/Il2bA6IuoancZwMYqH9t3nPOdKRP94WqbGmrQwc_b_0/upload.png" alt="Upload" />}
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
					<div>
						<HomeHeader loginToggle={this.toggleModal} />
						<div className="sizer">
							<div className="landing">
								<div>
									<h1>Email made <br/><TextLoop interval={2000}>
									<span>safer.</span>
									<span>faster.</span>
									<span>better.</span>
									<span>easier.</span>
									<span>quicker.</span>
									<span>permanent.</span>
									</TextLoop>{" "}</h1>
									<p><span className="highlight">Weve</span> lets you communicate with <span className="highlight">safety and security</span>.<br/>Begin <span className="highlight">sending messages</span> on the Arweave permaweb.</p>
									<button onClick={this.toggleModal}>Get Started</button>
								</div>
								<div>
									
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className="features sizer" id="features">
							<h1>End-to-end security</h1>
							<p>Weve runs on the Arweave network so messages are <i>permanent</i> and <i>uncensorable</i>.</p>
							<p>Messages are <i>encrypted</i> and delivered using <i>decentralized</i> technologies; cutting the middle-man.</p>
							<div className="feature-showcase">
								<FeatureItem image="https://pspfqlx3qgd7.arweave.net/Il2bA6IuoancZwMYqH9t3nPOdKRP94WqbGmrQwc_b_0/private.png" header="Encrypted" text="Weve encrypts your data with RSA-OAEP to ensure security." />
								<FeatureItem image="https://pspfqlx3qgd7.arweave.net/Il2bA6IuoancZwMYqH9t3nPOdKRP94WqbGmrQwc_b_0/uncensorable.png" header="Uncensorable" text="Hosted on the Arweave permaweb, Weve can't be censored." />
								<FeatureItem image="https://pspfqlx3qgd7.arweave.net/Il2bA6IuoancZwMYqH9t3nPOdKRP94WqbGmrQwc_b_0/decentralized.png" header="Decentralized" text="Weve skips the middle-man and harnesses the blockchain." />
							</div>
						</div>
					</div>
					<div>
						<div className="tech sizer" id="technology">
							<h1>How do I use Weve?</h1>
							<p>It's a simple <span className="highlight black">3-step process</span>.</p>
							<Usage />
						</div>
					</div>
					<div className="cta">
						<div className="sizer">
							<h1>Ready to get started?</h1>
							<a href="https://www.arweave.org/wallet" target="_blank" rel="noopener noreferrer">Get a wallet</a>
							<button onClick={this.toggleModal}>Login to mail</button>
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
									<li><a href="https://www.arweave.org/mine/learn-more" target="_blank" rel="noopener noreferrer">Learn more</a></li>
								</ul>
							</div>
							<div>
								<h3>Navigation</h3>
								<ul>
									<li><AnchorLink href="#top">Home</AnchorLink></li>
									<li><AnchorLink href="#features">Features</AnchorLink></li>
									<li><AnchorLink href="#technology">Technology</AnchorLink></li>
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
				<img src={this.props.image} alt="Feature item" />
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
			images: [
				"https://pspfqlx3qgd7.arweave.net/Il2bA6IuoancZwMYqH9t3nPOdKRP94WqbGmrQwc_b_0/steps1.png", 
				"https://pspfqlx3qgd7.arweave.net/Il2bA6IuoancZwMYqH9t3nPOdKRP94WqbGmrQwc_b_0/steps2.png", 
				"https://pspfqlx3qgd7.arweave.net/Il2bA6IuoancZwMYqH9t3nPOdKRP94WqbGmrQwc_b_0/steps3.png"
			]
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
					<span><img src={this.state.images[this.state.number]} className="usage-image" alt={`Step ${this.state.number}`} /></span>
				</div>
			</div>
		);
	}
}

export default withRouter(Home);
