import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Animated, View, Image, StyleSheet } from 'react-native'

// https://github.com/facebook/react-native/blob/master/Libraries/Image/ImageSourcePropType.js
const ImageURISourcePropType = PropTypes.shape({
  uri: PropTypes.string,
});

const ImageSourcePropType = PropTypes.oneOfType([
  ImageURISourcePropType,
  // Opaque type returned by require('./image.jpg')
  PropTypes.number,
  // Multiple sources
  PropTypes.arrayOf(ImageURISourcePropType),
]);

export default class ProgressiveImage extends Component {
  static propTypes = {
    placeHolderColor: PropTypes.string,
    placeHolderSource: ImageSourcePropType,
    imageSource: ImageSourcePropType.isRequired,
    imageFadeDuration: PropTypes.number.isRequired,
    onLoadThumbnail: PropTypes.func.isRequired,
    onLoadImage: PropTypes.func.isRequired,
    thumbnailSource: ImageSourcePropType.isRequired,
    thumbnailFadeDuration: PropTypes.number.isRequired,
    thumbnailBlurRadius: PropTypes.number,
  }

  static defaultProps = {
    thumbnailFadeDuration: 250,
    imageFadeDuration: 250,
    thumbnailBlurRadius: 5,
    onLoadThumbnail: Function.prototype,
    onLoadImage: Function.prototype,
  }

  constructor(props) {
    super(props)
    this.state = {
      imageOpacity: new Animated.Value(0),
      thumbnailOpacity: new Animated.Value(0),
    }
  }

  onLoadThumbnail() {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 1,
      duration: this.props.thumbnailFadeDuration,
    }).start()
    this.props.onLoadThumbnail()
  }

  onLoadImage() {
    Animated.timing(this.state.imageOpacity, {
      toValue: 1,
      duration: this.props.imageFadeDuration,
    }).start()
    this.props.onLoadImage()
  }

  render() {
    return (
      <View style={this.props.style}>
        <Image
          resizeMode="cover"
          style={[styles.image, this.props.style]}
          source={this.props.placeHolderSource}
        />
        <Animated.Image
          resizeMode="cover"
          style={[styles.image, { opacity: this.state.thumbnailOpacity }, this.props.style]}
          source={this.props.thumbnailSource}
          onLoad={() => this.onLoadThumbnail()}
          blurRadius={this.props.thumbnailBlurRadius}
        />
        <Animated.Image
          resizeMode="cover"
          style={[styles.image, { opacity: this.state.imageOpacity }, this.props.style]}
          source={this.props.imageSource}
          onLoad={() => this.onLoadImage()}
        />
      </View>
    )
  }
}

 const styles = StyleSheet.create({
   image: {
     position: 'absolute',
     top: 0,
     bottom: 0,
     left: 0,
     right: 0,
   },
 })
