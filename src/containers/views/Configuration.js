import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import Editor from '../../components/Editor';
import { putConfig, onEditorChange } from '../../actions/config';
import { getLeaveMessage } from '../../constants/messages';
import { toYAML } from '../../utils/helpers';

export class Configuration extends Component {

  componentDidMount() {
    const { router, route } = this.props;
    router.setRouteLeaveHook(route, this.routerWillLeave.bind(this));
  }

  routerWillLeave(nextLocation) {
    if (this.props.editorChanged) {
      return getLeaveMessage();
    }
  }

  handleSaveClick() {
    const { editorChanged, putConfig } = this.props;
    if (editorChanged) {
      const value = this.refs.editor.getValue();
      putConfig(value);
    }
  }

  render() {
    const { editorChanged, onEditorChange, config, updated } = this.props;
    return (
      <div>
        <div className="content-header">
          <h1>Configuration</h1>
          <div className="page-buttons">
            <a className={"btn " + (editorChanged ? 'btn-active':'btn-inactive')}
              onClick={() => this.handleSaveClick()}>
                {updated ? 'Saved' : 'Save'}
            </a>
          </div>
        </div>
        <Editor
          editorChanged={editorChanged}
          onEditorChange={onEditorChange}
          content={toYAML(config)}
          ref="editor" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { config } = state;
  return {
    config: config.config,
    updated: config.updated,
    editorChanged: config.editorChanged
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    putConfig,
    onEditorChange
  }, dispatch);
}

Configuration.propTypes = {
  config: PropTypes.object.isRequired,
  onEditorChange: PropTypes.func.isRequired,
  putConfig: PropTypes.func.isRequired,
  updated: PropTypes.bool.isRequired,
  editorChanged: PropTypes.bool.isRequired,
  router: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Configuration));
