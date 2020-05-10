import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { withRouter } from 'react-router-dom'
import { EditorState, convertToRaw } from 'draft-js';
import draftToMarkdown from 'draftjs-to-markdown';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './index.css';

class Compose extends React.Component {
	constructor() {
		super();

		this.state= {
			recipient: '',
			subject: '',
			numTokens: 0,
			editorState: EditorState.createEmpty()
		}
	}

	onEditorStateChange = editorState => {
		this.setState({editorState});
	};

	handleRecipientChange = event => {
		this.setState({recipient: event.target.value});
	};

	handleSubjectChange = event => {
		this.setState({subject: event.target.value});
	};

	handleNumTokensChange = event => {
		this.setState({numTokens: event.target.value});
	};

	save = () => {
		let randomID = (Math.random()*1e32).toString(36).substring(0, 10);
		let markdown = draftToMarkdown(convertToRaw(this.state.editorState.getCurrentContent()));

		let mail_item = {
			"id": randomID,
			"to": this.state.recipient,
			"subject": this.state.subject,
			"body": markdown,
			"amount": this.state.numTokens
		};

		let sessionDrafts = sessionStorage.getItem('drafts');
		let drafts;

		if (sessionDrafts !== null) {
			drafts = JSON.parse(sessionDrafts);
		} else {
			drafts = [];
		}

		drafts.push(mail_item);
		sessionStorage.setItem('drafts', JSON.stringify(drafts));
		this.props.toggleSelf();
		this.props.history.push(`/drafts/${randomID}`);
	}

	render() {
		return (
			<div className="compose-modal">
				<div>
					<h2>Compose mail</h2>
					<span>Send a weve mail.</span>
				</div>
				<div>
					<div>
						<span>Mail recipient</span>
						<input type="text" value={this.state.recipient} onChange={this.handleRecipientChange} placeholder="cVp3bbGwp9EfSAMPLE9ej3nssi303nn300ns03i"/>
					</div>
					<div>
						<span>Mail subject</span>
						<input value={this.state.subject} onChange={this.handleSubjectChange} type="text" />
					</div>
					<div>
						<span>Mail body</span>
						<Editor
							editorState={this.state.editorState}
							toolbar={toolbarOptions}
							toolbarClassName="editor-toolbar"
							wrapperClassName="editor-wrapper"
							editorClassName="editor"
							onEditorStateChange={this.onEditorStateChange}
						/>
					</div>
					<div>
						<span>AR tokens to send</span>
						<input value={this.state.numTokens} onChange={this.handleNumTokensChange} type="number" />
					</div>
				</div>
				<div>
					<button onClick={this.save}><i className="fa fa-floppy-o"></i>Save and close</button>
					<button><i className="fa fa-send-o"></i>Send</button>
				</div>
			</div>
		);
	}
}

export default withRouter(Compose);

const toolbarOptions = {
	options: ['inline', 'fontSize', 'list', 'link', 'image'],
	inline: {
		options: ['bold', 'italic', 'underline', 'strikethrough'],
	},
	list: {
		options: ['unordered', 'ordered'],
	},
	image: {
		uploadEnabled: false,
	}
}
