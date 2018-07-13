import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback, Platform } from "react-native";
import { connect } from "react-redux";
import CustomFieldImageCard from "./CustomFieldImageCard";
import CustomFieldVideoCard from "./CustomFieldVideoCard";
import CustomFieldPdfCard from "./CustomFieldPdfCard";
import CustomFieldDownloadCard from "./CustomFieldDownloadCard";
import CustomFieldEmptyCard from "./CustomFieldEmptyCard";
import { localize } from "../util/localize";
import { routes } from "../navigation/config";
import * as indexSelector from "../selectors";
import * as actions from "../actions";

class CustomFieldMedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      cfNamespace: props.cfNamespace,
      isOpenedModalImage: false,
      isNewUploadedFileAvailable: false,
      thumbImgUrl: this.props.thumbImgUrl
    };
  }

  // Run after component loaded, if the actual content is an image, otherwise it will download it, by the button push
  componentDidMount() {
    const imageExtensions = [
      "jpg",
      "gif",
      "png",
      "bmp",
      "JPG",
      "GIF",
      "PNG",
      "BMP"
    ];
    if (
      this.props.value &&
      imageExtensions.indexOf(this.props.value.split(".").pop()) >= 0
    ) {
      const payload = {
        fieldid: this.props.id,
        jobOrRouteId: this.props.jobOrRouteId.toString(),
        filename: this.props.value,
        cfNamespace: this.props.cfNamespace
      };
      this.props.downloadMediaCustomFieldThumbnails(payload);
    }
  }

  componentWillReceiveProps(nextProps) {
    const imageExtensions = [
      "jpg",
      "gif",
      "png",
      "bmp",
      "JPG",
      "GIF",
      "PNG",
      "BMP"
    ];
    if (
      nextProps.value &&
      this.props.value !== nextProps.value &&
      imageExtensions.indexOf(nextProps.value.split(".").pop()) >= 0
    ) {
      const payload = {
        fieldid: nextProps.id,
        jobOrRouteId: nextProps.jobOrRouteId.toString(),
        filename: nextProps.value,
        cfNamespace: nextProps.cfNamespace
      };
      this.props.downloadMediaCustomFieldThumbnails(payload);
    }
    if (
      nextProps.value &&
      nextProps.thumbImgUrl &&
      this.state.thumbImgUrl !== nextProps.thumbImgUrl
    ) {
      this.setState({ thumbImgUrl: nextProps.thumbImgUrl });
    }
    if (!nextProps.value) {
      this.setState({ thumbImgUrl: null });
    }
  }

  _getFileTypeByName = filename => {
    let extension = filename.split(".").pop();
    if (
      ["jpg", "gif", "png", "jpeg", "JPG", "GIF", "PNG", "JPEG"].indexOf(
        extension
      ) > -1
    ) {
      return "Image";
    } else if (
      ["mp4", "mp3", "ogv", "webm", "MP4", "MP3", "OGV", "WEBM"].indexOf(
        extension
      ) > -1
    ) {
      return "Video";
    } else if (extension.toLowerCase() === "pdf") {
      return "Pdf";
    } else {
      return "Other";
    }
  };

  _getMimeTypeByExtension = extension => {
    let mimetype = "";
    switch (
      extension // mime type
    ) {
      case "mp4":
        mimetype = "video/mp4";
        break;
      case "avi":
        mimetype = "video/x-msvideo";
        break;
      case "wmv":
        mimetype = "video/x-ms-wmv";
        break;
      case "ogv":
        mimetype = "video/ogg";
        break;
      case "webm":
        mimetype = "video/webm";
        break;
      default:
        mimetype = "application/octet-stream";
        break;
    }
    return mimetype;
  };

  onClickDownload = () => {
    const payload = {
      fieldid: this.props.id,
      jobOrRouteId: this.props.jobOrRouteId.toString(),
      filename: this.props.value,
      cfNamespace: this.props.cfNamespace
    };
    this.props.downloadAndOpenWithExternalApp(payload);
  };

  _openImage = () => {
    const navigator = this.props.navigator;
    const props = this.props;
    const payload = {
      fieldid: props.id,
      jobOrRouteId: props.jobOrRouteId.toString(),
      filename: props.value,
      cfNamespace: props.cfNamespace
    };
    const cleanedLargeName =
      this.props.imgurl && this.props.imgurl.split("/").pop();
    const cleanedThumbName =
      this.state.thumbImgUrl &&
      this.state.thumbImgUrl
        .split("/")
        .pop()
        .replace("_thumb", "");
    if (
      props.imgurl === null ||
      props.imgurl === undefined ||
      props.imgurl.trim() === "" ||
      cleanedLargeName !== cleanedThumbName
    ) {
      props.downloadMediaCustomFieldFile(payload);
    }
    if (navigator) {
      navigator.push(routes.photoView(payload));
    }
  };

  _openPdf = () => {
    const navigator = this.props.navigator;
    const props = this.props;
    const payload = {
      fieldid: props.id,
      jobOrRouteId: props.jobOrRouteId.toString(),
      filename: props.value,
      cfNamespace: props.cfNamespace
    };
    if (navigator) {
      navigator.push(routes.pdfView(payload));
    }
  };

  _closeModalImage = () => {
    this.setState({
      isOpenedModalImage: false
    });
  };

  _uploadNewContent = () => {
    const ImagePicker = require("react-native-image-picker");
    // More info on all the options is below in the README...just some common use cases shown here
    const options = {
      title: localize("Select file"),
      cancelButtonTitle: localize("Cancel"),
      takePhotoButtonTitle: localize("Take photo"),
      chooseFromLibraryButtonTitle: localize("Choose from library"),
      customButtons: [
        { name: "signaturedraw", title: localize("Signature draw") },
        { name: "deleteMedia", title: localize("Delete media") }
      ],
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info below in README)
     */
    ImagePicker.showImagePicker(options, response => {
      // console.debug("response", response);
      if (response.customButton) {
        if (response.customButton === "signaturedraw") {
          const navigator = this.props.navigator;
          if (navigator) {
            navigator.push(routes.signature(this._saveMedia));
          }
        }

        if (response.customButton === "deleteMedia") {
          this.props.onSave("");
        }
      } else {
        if (!response.didCancel) {
          response.uri = response.path;
          this._saveMedia(response);
        }
      }
    });
  };

  _getThumbImgUrl = () => {
    if (this.props.imgurl) {
      return this.props.imgurl;
    }
    if (this.props.thumbImgUrl) {
      return this.props.thumbImgUrl;
    }
    if (this.state.thumbImgUrl) {
      return this.state.thumbImgUrl;
    }
    return undefined;
  };

  _saveMedia = response => {
    const payload = {
      fieldid: this.props.id,
      jobOrRouteId: this.props.jobOrRouteId.toString(),
      cfNamespace: this.props.cfNamespace,
      filename: response.fileName,
      uploadFile: response.data,
      filePath: response.uri
    };
    this.props.uploadMediaCustomFieldFile(payload);
    this.props.onSave && this.props.onSave(response.fileName);
    this.setState({
      isNewUploadedFileAvailable: true,
      thumbImgUrl: response.uri
    });
  };

  _renderImage = () => {
    return (
      <CustomFieldImageCard
        key={"cfimage_" + this.props.id}
        imgurl={this.props.imgurl}
        onPress={this._openImage}
        label={this.props.label}
        cfNamespace={this.props.cfNamespace}
        uploadNewContent={this._uploadNewContent}
        uploadprogress={this.props.uploadprogress}
        thumbnailUrl={this._getThumbImgUrl()}
      />
    );
  };

  _renderVideo = () => {
    return (
      <CustomFieldVideoCard
        key={"cfvideo_" + this.props.id}
        value={this.props.value}
        onPress={this.onClickDownload}
        label={this.props.label}
        cfNamespace={this.props.cfNamespace}
        uploadNewContent={this._uploadNewContent}
        uploadprogress={this.props.uploadprogress}
        progress={this.props.progress}
      />
    );
  };

  _renderPdf = () => {
    return (
      <CustomFieldPdfCard
        key={"cfPdf_" + this.props.id}
        onPress={this._openPdf}
        value={this.props.value}
        label={this.props.label}
        cfNamespace={this.props.cfNamespace}
        uploadNewContent={this._uploadNewContent}
        uploadprogress={this.props.uploadprogress}
      />
    );
  };

  _renderOther = () => {
    return (
      <CustomFieldDownloadCard
        key={"cfdownload_" + this.props.id}
        value={this.props.value}
        onPress={this.onClickDownload}
        label={this.props.label}
        cfNamespace={this.props.cfNamespace}
        uploadNewContent={this._uploadNewContent}
        uploadprogress={this.props.uploadprogress}
        progress={this.props.progress}
      />
    );
  };

  _renderEmpty = () => {
    return (
      <CustomFieldEmptyCard
        key={"cfempty_" + this.props.id}
        label={this.props.label}
        cfNamespace={this.props.cfNamespace}
        uploadNewContent={this._uploadNewContent}
        uploadprogress={this.props.uploadprogress}
      />
    );
  };

  renderMediaField() {
    const fileType =
      this.props.value && this._getFileTypeByName(this.props.value);

    if (fileType === "Image") {
      return this._renderImage(); // or even a new component
    } else if (fileType === "Video") {
      return this._renderVideo(); // or even a new component
    } else if (fileType === "Pdf") {
      return this._renderPdf(); // or even a new component
    } else if (fileType === "Other") {
      return this._renderOther(); // or even a new component
    }
    return this._renderEmpty(); // or even a new component
  }

  render() {
    if (Platform.OS === "ios") {
      return (
        <TouchableWithoutFeedback onPress={() => this.input.focus()}>
          {this.renderMediaField()}
        </TouchableWithoutFeedback>
      );
    } else {
      return this.renderMediaField();
    }
  }
}

CustomFieldMedia.defaultProps = {
  showActions: false
};

CustomFieldMedia.contextTypes = {
  tabBar: PropTypes.object
};

const mapStateToProps = (initialState, initialProps) => {
  const { jobOrRouteId, id } = initialProps;
  return state => indexSelector.getCfData(state, "job", jobOrRouteId, id);
};

const mapDispatchToProps = {
  downloadMediaCustomFieldThumbnails:
    actions.downloadMediaCustomFieldThumbnails.init,
  downloadMediaCustomFieldFile: actions.downloadMediaCustomFieldFile.init,
  uploadMediaCustomFieldFile: actions.uploadMediaCustomFieldFile.init,
  downloadAndOpenWithExternalApp: actions.downloadAndOpenWithExternalApp
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(CustomFieldMedia);
