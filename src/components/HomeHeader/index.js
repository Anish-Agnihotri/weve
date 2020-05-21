import React from 'react';
import { NavLink } from 'react-router-dom'; // Navigation
import { HamburgerButton } from 'react-hamburger-button'; // Mobile menu button
import AnchorLink from 'react-anchor-link-smooth-scroll'; // Smooth scroll for anchor links
import './index.css';

export default class HomeHeader extends React.Component {
	constructor() {
		super();

		this.state = {
			open: false, // Mobile menu is closed by default
		}
	}

	updateDimensions = e => {
		// If window width > 700
		if (window.innerWidth > 700) {
			// Keep mobile menu closed
			this.setState({open: false});
		}
	};

	componentDidMount() {
		this.updateDimensions(); // Update dimensions on load
		// Setup an event listener for resize
		window.addEventListener('resize', this.updateDimensions.bind(this));
	}

	componentWillUnmount() {
		// Remove event listener on component unmount for performance
		window.removeEventListener('resize', this.updateDimensions.bind(this));
	}

	render() {
		return (
			<div className="homeheader">
				<div className="sizer">
					<div className="logo">
						<NavLink to="/">
							<h1>weve.</h1>
						</NavLink>
					</div>
					<div className="menu">
						<nav>
							<ul>
								<li><AnchorLink href="#features">Features</AnchorLink></li>
								<li><AnchorLink href="#quickstart">Quickstart</AnchorLink></li>
								<li><button onClick={this.props.loginToggle}>Login</button></li>
							</ul>
						</nav>
						<div className="hamburger">
							<HamburgerButton
								open={this.state.open}
								onClick={() => this.setState(previous => ({open: !previous.open}))}
								width={25}
								height={12}
								strokeWidth={2}
								color='#8991A9'
								animationDuration={0.5}
							/>
						</div>
					</div>
					<div className={`menu-mobile ${this.state.open ? "shown" : "hidden"}`}>
						<nav>
							<ul>
								<li><AnchorLink onClick={this.state.open ? () => this.setState({open: false}) : null} href="#features">Features</AnchorLink></li>
								<li><AnchorLink onClick={this.state.open ? () => this.setState({open: false}) : null} href="#quickstart">Quickstart</AnchorLink></li>
								<li><button onClick={this.props.loginToggle}>Login</button></li>
							</ul>
						</nav>
					</div>
				</div>
			</div>
		);
	}
}
