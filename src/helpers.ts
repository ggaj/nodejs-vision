// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ** This file is automatically generated by gapic-generator-typescript. **
// ** https://github.com/googleapis/gapic-generator-typescript **
// ** All changes to this file may be overwritten. **

import * as fs from 'fs';
import * as is from 'is';
import {promisify} from '@google-cloud/promisify';
import * as gax from 'google-gax';

// We only need to have a Feature enum from the protos, and we want
// this enum to work for both gRPC and fallback scenarios.
// It's enough to have the contents of JSON proto for this purpose.
import * as protoTypes from '../protos/protos';

interface ImprovedRequest {
  image?: {source?: {filename: string}; content?: Uint8Array | string | null};
  // tslint:disable-next-line no-any
  features?: any;
}
// tslint:disable-next-line no-any
const _requestToObject = (request: any) => {
  if (is.string(request)) {
    // Is this a URL or a local file?
    // Guess based on what the string looks like, and build the full
    // request object in the correct format.
    if (request.indexOf('://') === -1 || request.indexOf('file://') === 0) {
      request = ({
        image: {source: {filename: request}},
      } as unknown) as ImprovedRequest;
    } else {
      request = ({
        image: {source: {imageUri: request}},
      } as unknown) as ImprovedRequest;
    }
  } else if (Buffer.isBuffer(request)) {
    // Drop the buffer one level lower; it will get dealt with later
    // in the function. This allows sending <Buffer> and {image: <Buffer>} to
    // both work identically.
    request = ({image: request} as unknown) as ImprovedRequest;
  }
  return (request as unknown) as ImprovedRequest;
};

const _coerceRequest = (request: ImprovedRequest, callback: Function) => {
  // At this point, request must be an object with an `image` key; if not,
  // it is an error. If there is no image, throw an exception.
  if (!is.object(request) || is.undefined(request.image)) {
    return callback(new Error('No image present.'));
  }
  // If this is a buffer, read it and send the object
  // that the Vision API expects.
  if (Buffer.isBuffer(request.image)) {
    request.image = {content: request.image.toString('base64')};
  }

  // If the file is specified as a filename and exists on disk, read it
  // and coerce it into the base64 content.
  if (request.image!.source && request.image!.source.filename) {
    fs.readFile(request.image!.source.filename, (err, blob) => {
      if (err) {
        callback(err);
        return;
      }
      request.image!.content = blob.toString('base64');
      delete request.image!.source;
      return callback(null, request);
    });
  } else {
    return callback(null, request);
  }
};

const _createSingleFeatureMethod = (
  featureValue: protoTypes.google.cloud.vision.v1.Feature.Type
) => {
  return function(
    request: string,
    callOptions?: gax.CallOptions,
    callback?: Function | gax.CallOptions
  ) {
    // Sanity check: If we got a string or buffer, we need this to be
    // in object form now, so we can tack on the features list.
    //
    // Do the minimum required conversion, which can also be guaranteed to
    // be synchronous (e.g. no file loading yet; that is handled by
    // annotateImage later.
    const annotateImageRequest: ImprovedRequest = _requestToObject(request);
    // If a callback was provided and options were skipped, normalize
    // the argument names.
    if (is.undefined(callback) && is.function(callOptions)) {
      callback = callOptions;
      callOptions = undefined;
    }

    // Add the feature to the request.
    annotateImageRequest.features = annotateImageRequest.features || [
      {
        type: featureValue,
      },
    ];

    // If the user submitted explicit features that do not line up with
    // the precise method called, throw an exception.
    for (const feature of annotateImageRequest.features) {
      if (feature.type !== featureValue) {
        throw new Error(
          'Setting explicit features is not supported on this method. ' +
            'Use the #annotateImage method instead.'
        );
      }
    }
    // Call the underlying #annotateImage method.
    // @ts-ignore
    return this.annotateImage(annotateImageRequest, callOptions, callback);
  };
};

export function call(apiVersion: string) {
  // const client = require(`./${apiVersion}`).ImageAnnotatorClient;
  let methods: {[methodName: string]: Function} = {
    annotateImage: Function,
    faceDetection: Function,
    landmarkDetection: Function,
    labelDetection: Function,
    safeSearchDetection: Function,
    imageProperties: Function,
    cropHints: Function,
    webDetection: Function,
  };

  methods.annotateImage = promisify(function(
    request: ImprovedRequest,
    callOptions: gax.CallOptions,
    callback: Function | gax.CallOptions
  ) {
    // If a callback was provided and options were skipped, normalize
    // the argument names.
    if (is.undefined(callback) && is.function(callOptions)) {
      callback = callOptions;
      callOptions = (undefined as unknown) as gax.CallOptions;
    }

    // If we got a filename for the image, open the file and transform
    // it to content.
    return _coerceRequest(request, (err: {}, req: string) => {
      if (err) {
        return ((callback as unknown) as Function)(err);
      }

      // Call the GAPIC batch annotation function.
      const requests = {requests: [req]};
      // @ts-ignore
      return this.batchAnnotateImages(
        requests,
        callOptions,
        (err: {}, r: {responses: {[index: number]: string}}) => {
          // If there is an error, handle it.
          if (err) {
            return ((callback as unknown) as Function)(err);
          }

          // We are guaranteed to only have one response element, since we
          // only sent one image.
          const response = r.responses[0];

          // Fire the callback if applicable.
          return ((callback as unknown) as Function)(undefined, response);
        }
      );
    });
  });

  const protoFilesRoot = gax.protobuf.Root.fromJSON(
    require('../protos/protos.json')
  );
  const features = (protoFilesRoot.lookup(
    `google.cloud.vision.${apiVersion}.Feature.Type`
  ) as gax.protobuf.Enum).values;

  /**
   * Annotate a single image with face detection.
   *
   * @see v1.ImageAnnotatorClient#batchAnnotateImages
   * @see google.cloud.vision.v1.AnnotateImageRequest
   *
   * @method v1.ImageAnnotatorClient#faceDetection
   * @param {object|string|Buffer} request A representation of the request
   *     being sent to the Vision API. This is an
   *     {@link google.cloud.vision.v1.AnnotateImageRequest AnnotateImageRequest}.
   *     For simple cases, you may also send a string (the URL or filename of
   *     the image) or a buffer (the image itself).
   * @param {object} request.image A dictionary-like object representing the
   *     image. This should have a single key (`source`, `content`).
   *
   *     If the key is `source`, the value should be another object containing
   *     `imageUri` or `filename` as a key and a string as a value.
   *
   *     If the key is `content`, the value should be a Buffer.
   * @param {object} [callOptions] Optional parameters. You can override the
   *     default settings for this call, e.g, timeout, retries, paginations,
   *     etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions}
   *     for the details.
   * @param {function(?Error, ?object)} [callback] The function which will be
   *     called with the result of the API call.
   *
   *     The second parameter to the callback is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   * @returns {Promise} The promise which resolves to an array. The first
   *     element of the array is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   *     The promise has a method named "cancel" which cancels the ongoing API
   *     call.
   *
   * @example
   * const vision = require('@google-cloud/vision');
   * const client = new vision.ImageAnnotatorClient();
   *
   * const request = {
   *   image: {
   *     source: {imageUri: 'gs://path/to/image.jpg'}
   *   }
   * };
   *
   * client
   *   .faceDetection(request)
   *   .then(response => {
   *     // doThingsWith(response);
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  methods.faceDetection = promisify(
    _createSingleFeatureMethod(features!.FACE_DETECTION)
  );
  /**
   * Annotate a single image with landmark detection.
   *
   * @see v1.ImageAnnotatorClient#batchAnnotateImages
   * @see google.cloud.vision.v1.AnnotateImageRequest
   *
   * @method v1.ImageAnnotatorClient#landmarkDetection
   * @param {object|string|Buffer} request A representation of the request
   *     being sent to the Vision API. This is an
   *     {@link google.cloud.vision.v1.AnnotateImageRequest AnnotateImageRequest}.
   *     For simple cases, you may also send a string (the URL or filename of
   *     the image) or a buffer (the image itself).
   * @param {object} request.image A dictionary-like object representing the
   *     image. This should have a single key (`source`, `content`).
   *
   *     If the key is `source`, the value should be another object containing
   *     `imageUri` or `filename` as a key and a string as a value.
   *
   *     If the key is `content`, the value should be a Buffer.
   * @param {object} [callOptions] Optional parameters. You can override the
   *     default settings for this call, e.g, timeout, retries, paginations,
   *     etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions}
   *     for the details.
   * @param {function(?Error, ?object)} [callback] The function which will be
   *     called with the result of the API call.
   *
   *     The second parameter to the callback is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   * @returns {Promise} The promise which resolves to an array. The first
   *     element of the array is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   *     The promise has a method named "cancel" which cancels the ongoing API
   *     call.
   *
   * @example
   * const vision = require('@google-cloud/vision');
   * const client = new vision.ImageAnnotatorClient();
   *
   * const request = {
   *   image: {
   *     source: {imageUri: 'gs://path/to/image.jpg'}
   *   }
   * };
   *
   * client
   *   .landmarkDetection(request)
   *   .then(response => {
   *     // doThingsWith(response);
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */

  methods.landmarkDetection = promisify(
    _createSingleFeatureMethod(features!.LANDMARK_DETECTION)
  );

  /**
   * Annotate a single image with text detection.
   *
   * @see v1.ImageAnnotatorClient#batchAnnotateImages
   * @see google.cloud.vision.v1.AnnotateImageRequest
   *
   * @method v1.ImageAnnotatorClient#textDetection
   * @param {object|string|Buffer} request A representation of the request
   *     being sent to the Vision API. This is an
   *     {@link google.cloud.vision.v1.AnnotateImageRequest AnnotateImageRequest}.
   *     For simple cases, you may also send a string (the URL or filename of
   *     the image) or a buffer (the image itself).
   * @param {object} request.image A dictionary-like object representing the
   *     image. This should have a single key (`source`, `content`).
   *
   *     If the key is `source`, the value should be another object containing
   *     `imageUri` or `filename` as a key and a string as a value.
   *
   *     If the key is `content`, the value should be a Buffer.
   * @param {object} [callOptions] Optional parameters. You can override the
   *     default settings for this call, e.g, timeout, retries, paginations,
   *     etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions}
   *     for the details.
   * @param {function(?Error, ?object)} [callback] The function which will be
   *     called with the result of the API call.
   *
   *     The second parameter to the callback is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   * @returns {Promise} The promise which resolves to an array. The first
   *     element of the array is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   *     The promise has a method named "cancel" which cancels the ongoing API
   *     call.
   *
   * @example
   * const vision = require('@google-cloud/vision');
   * const client = new vision.ImageAnnotatorClient();
   *
   * const request = {
   *   image: {
   *     source: {imageUri: 'gs://path/to/image.jpg'}
   *   }
   * };
   *
   * client
   *   .textDetection(request)
   *   .then(response => {
   *     // doThingsWith(response);
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  methods.textDetection = promisify(
    _createSingleFeatureMethod(features.TEXT_DETECTION)
  );
  /**
   * Annotate a single image with logo detection.
   *
   * @see v1.ImageAnnotatorClient#batchAnnotateImages
   * @see google.cloud.vision.v1.AnnotateImageRequest
   *
   * @method v1.ImageAnnotatorClient#logoDetection
   * @param {object|string|Buffer} request A representation of the request
   *     being sent to the Vision API. This is an
   *     {@link google.cloud.vision.v1.AnnotateImageRequest AnnotateImageRequest}.
   *     For simple cases, you may also send a string (the URL or filename of
   *     the image) or a buffer (the image itself).
   * @param {object} request.image A dictionary-like object representing the
   *     image. This should have a single key (`source`, `content`).
   *
   *     If the key is `source`, the value should be another object containing
   *     `imageUri` or `filename` as a key and a string as a value.
   *
   *     If the key is `content`, the value should be a Buffer.
   * @param {object} [callOptions] Optional parameters. You can override the
   *     default settings for this call, e.g, timeout, retries, paginations,
   *     etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions}
   *     for the details.
   * @param {function(?Error, ?object)} [callback] The function which will be
   *     called with the result of the API call.
   *
   *     The second parameter to the callback is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   * @returns {Promise} The promise which resolves to an array. The first
   *     element of the array is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   *     The promise has a method named "cancel" which cancels the ongoing API
   *     call.
   *
   * @example
   * const vision = require('@google-cloud/vision');
   * const client = new vision.ImageAnnotatorClient();
   *
   * const request = {
   *   image: {
   *     source: {imageUri: 'gs://path/to/image.jpg'}
   *   }
   * };
   *
   * client
   *   .logoDetection(request)
   *   .then(response => {
   *     // doThingsWith(response);
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  methods.logoDetection = promisify(
    _createSingleFeatureMethod(features.LOGO_DETECTION)
  );
  /**
   * Annotate a single image with label detection.
   *
   * @see v1.ImageAnnotatorClient#batchAnnotateImages
   * @see google.cloud.vision.v1.AnnotateImageRequest
   *
   * @method v1.ImageAnnotatorClient#labelDetection
   * @param {object|string|Buffer} request A representation of the request
   *     being sent to the Vision API. This is an
   *     {@link google.cloud.vision.v1.AnnotateImageRequest AnnotateImageRequest}.
   *     For simple cases, you may also send a string (the URL or filename of
   *     the image) or a buffer (the image itself).
   * @param {object} request.image A dictionary-like object representing the
   *     image. This should have a single key (`source`, `content`).
   *
   *     If the key is `source`, the value should be another object containing
   *     `imageUri` or `filename` as a key and a string as a value.
   *
   *     If the key is `content`, the value should be a Buffer.
   * @param {object} [callOptions] Optional parameters. You can override the
   *     default settings for this call, e.g, timeout, retries, paginations,
   *     etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions}
   *     for the details.
   * @param {function(?Error, ?object)} [callback] The function which will be
   *     called with the result of the API call.
   *
   *     The second parameter to the callback is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   * @returns {Promise} The promise which resolves to an array. The first
   *     element of the array is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   *     The promise has a method named "cancel" which cancels the ongoing API
   *     call.
   *
   * @example
   * const vision = require('@google-cloud/vision');
   * const client = new vision.ImageAnnotatorClient();
   *
   * const request = {
   *   image: {
   *     source: {imageUri: 'gs://path/to/image.jpg'}
   *   }
   * };
   *
   * client
   *   .labelDetection(request)
   *   .then(response => {
   *     // doThingsWith(response);
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */

  methods.labelDetection = promisify(
    _createSingleFeatureMethod(features!.LABEL_DETECTION)
  );
  /**
   * Annotate a single image with safe search detection.
   *
   * @see v1.ImageAnnotatorClient#batchAnnotateImages
   * @see google.cloud.vision.v1.AnnotateImageRequest
   *
   * @method v1.ImageAnnotatorClient#safeSearchDetection
   * @param {object|string|Buffer} request A representation of the request
   *     being sent to the Vision API. This is an
   *     {@link google.cloud.vision.v1.AnnotateImageRequest AnnotateImageRequest}.
   *     For simple cases, you may also send a string (the URL or filename of
   *     the image) or a buffer (the image itself).
   * @param {object} request.image A dictionary-like object representing the
   *     image. This should have a single key (`source`, `content`).
   *
   *     If the key is `source`, the value should be another object containing
   *     `imageUri` or `filename` as a key and a string as a value.
   *
   *     If the key is `content`, the value should be a Buffer.
   * @param {object} [callOptions] Optional parameters. You can override the
   *     default settings for this call, e.g, timeout, retries, paginations,
   *     etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions}
   *     for the details.
   * @param {function(?Error, ?object)} [callback] The function which will be
   *     called with the result of the API call.
   *
   *     The second parameter to the callback is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   * @returns {Promise} The promise which resolves to an array. The first
   *     element of the array is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   *     The promise has a method named "cancel" which cancels the ongoing API
   *     call.
   *
   * @example
   * const vision = require('@google-cloud/vision');
   * const client = new vision.ImageAnnotatorClient();
   *
   * const request = {
   *   image: {
   *     source: {imageUri: 'gs://path/to/image.jpg'}
   *   }
   * };
   *
   * client
   *   .safeSearchDetection(request)
   *   .then(response => {
   *     // doThingsWith(response);
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */

  methods.safeSearchDetection = promisify(
    _createSingleFeatureMethod(features!.SAFE_SEARCH_DETECTION)
  );
  /**
   * Annotate a single image with image properties.
   *
   * @see v1.ImageAnnotatorClient#batchAnnotateImages
   * @see google.cloud.vision.v1.AnnotateImageRequest
   *
   * @method v1.ImageAnnotatorClient#imageProperties
   * @param {object|string|Buffer} request A representation of the request
   *     being sent to the Vision API. This is an
   *     {@link google.cloud.vision.v1.AnnotateImageRequest AnnotateImageRequest}.
   *     For simple cases, you may also send a string (the URL or filename of
   *     the image) or a buffer (the image itself).
   * @param {object} request.image A dictionary-like object representing the
   *     image. This should have a single key (`source`, `content`).
   *
   *     If the key is `source`, the value should be another object containing
   *     `imageUri` or `filename` as a key and a string as a value.
   *
   *     If the key is `content`, the value should be a Buffer.
   * @param {object} [callOptions] Optional parameters. You can override the
   *     default settings for this call, e.g, timeout, retries, paginations,
   *     etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions}
   *     for the details.
   * @param {function(?Error, ?object)} [callback] The function which will be
   *     called with the result of the API call.
   *
   *     The second parameter to the callback is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   * @returns {Promise} The promise which resolves to an array. The first
   *     element of the array is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   *     The promise has a method named "cancel" which cancels the ongoing API
   *     call.
   *
   * @example
   * const vision = require('@google-cloud/vision');
   * const client = new vision.ImageAnnotatorClient();
   *
   * const request = {
   *   image: {
   *     source: {imageUri: 'gs://path/to/image.jpg'}
   *   }
   * };
   *
   * client
   *   .imageProperties(request)
   *   .then(response => {
   *     // doThingsWith(response);
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  methods.imageProperties = promisify(
    _createSingleFeatureMethod(features!.IMAGE_PROPERTIES)
  );
  /**
   * Annotate a single image with crop hints.
   *
   * @see v1.ImageAnnotatorClient#batchAnnotateImages
   * @see google.cloud.vision.v1.AnnotateImageRequest
   *
   * @method v1.ImageAnnotatorClient#cropHints
   * @param {object|string|Buffer} request A representation of the request
   *     being sent to the Vision API. This is an
   *     {@link google.cloud.vision.v1.AnnotateImageRequest AnnotateImageRequest}.
   *     For simple cases, you may also send a string (the URL or filename of
   *     the image) or a buffer (the image itself).
   * @param {object} request.image A dictionary-like object representing the
   *     image. This should have a single key (`source`, `content`).
   *
   *     If the key is `source`, the value should be another object containing
   *     `imageUri` or `filename` as a key and a string as a value.
   *
   *     If the key is `content`, the value should be a Buffer.
   * @param {object} [callOptions] Optional parameters. You can override the
   *     default settings for this call, e.g, timeout, retries, paginations,
   *     etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions}
   *     for the details.
   * @param {function(?Error, ?object)} [callback] The function which will be
   *     called with the result of the API call.
   *
   *     The second parameter to the callback is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   * @returns {Promise} The promise which resolves to an array. The first
   *     element of the array is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   *     The promise has a method named "cancel" which cancels the ongoing API
   *     call.
   *
   * @example
   * const vision = require('@google-cloud/vision');
   * const client = new vision.ImageAnnotatorClient();
   *
   * const request = {
   *   image: {
   *     source: {imageUri: 'gs://path/to/image.jpg'}
   *   }
   * };
   *
   * client
   *   .cropHints(request)
   *   .then(response => {
   *     // doThingsWith(response);
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  methods.cropHints = promisify(
    _createSingleFeatureMethod(features!.CROP_HINTS)
  );
  /**
   * Annotate a single image with web detection.
   *
   * @see v1.ImageAnnotatorClient#batchAnnotateImages
   * @see google.cloud.vision.v1.AnnotateImageRequest
   *
   * @method v1.ImageAnnotatorClient#webDetection
   * @param {object|string|Buffer} request A representation of the request
   *     being sent to the Vision API. This is an
   *     {@link google.cloud.vision.v1.AnnotateImageRequest AnnotateImageRequest}.
   *     For simple cases, you may also send a string (the URL or filename of
   *     the image) or a buffer (the image itself).
   * @param {object} request.image A dictionary-like object representing the
   *     image. This should have a single key (`source`, `content`).
   *
   *     If the key is `source`, the value should be another object containing
   *     `imageUri` or `filename` as a key and a string as a value.
   *
   *     If the key is `content`, the value should be a Buffer.
   * @param {object} [callOptions] Optional parameters. You can override the
   *     default settings for this call, e.g, timeout, retries, paginations,
   *     etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions}
   *     for the details.
   * @param {function(?Error, ?object)} [callback] The function which will be
   *     called with the result of the API call.
   *
   *     The second parameter to the callback is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   * @returns {Promise} The promise which resolves to an array. The first
   *     element of the array is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   *     The promise has a method named "cancel" which cancels the ongoing API
   *     call.
   *
   * @example
   * const vision = require('@google-cloud/vision');
   * const client = new vision.ImageAnnotatorClient();
   *
   * const request = {
   *   image: {
   *     source: {imageUri: 'gs://path/to/image.jpg'}
   *   }
   * };
   *
   * client
   *   .webDetection(request)
   *   .then(response => {
   *     // doThingsWith(response);
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  methods.webDetection = promisify(
    _createSingleFeatureMethod(features!.WEB_DETECTION)
  );
  /**
   * Annotate a single image with document text detection.
   *
   * @see v1.ImageAnnotatorClient#batchAnnotateImages
   * @see google.cloud.vision.v1.AnnotateImageRequest
   *
   * @method v1.ImageAnnotatorClient#documentTextDetection
   * @param {object|string|Buffer} request A representation of the request
   *     being sent to the Vision API. This is an
   *     {@link google.cloud.vision.v1.AnnotateImageRequest AnnotateImageRequest}.
   *     For simple cases, you may also send a string (the URL or filename of
   *     the image) or a buffer (the image itself).
   * @param {object} request.image A dictionary-like object representing the
   *     image. This should have a single key (`source`, `content`).
   *
   *     If the key is `source`, the value should be another object containing
   *     `imageUri` or `filename` as a key and a string as a value.
   *
   *     If the key is `content`, the value should be a Buffer.
   * @param {object} [callOptions] Optional parameters. You can override the
   *     default settings for this call, e.g, timeout, retries, paginations,
   *     etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions}
   *     for the details.
   * @param {function(?Error, ?object)} [callback] The function which will be
   *     called with the result of the API call.
   *
   *     The second parameter to the callback is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   * @returns {Promise} The promise which resolves to an array. The first
   *     element of the array is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   *     The promise has a method named "cancel" which cancels the ongoing API
   *     call.
   *
   * @example
   * const vision = require('@google-cloud/vision');
   * const client = new vision.ImageAnnotatorClient();
   *
   * const request = {
   *   image: {
   *     source: {imageUri: 'gs://path/to/image.jpg'}
   *   }
   * };
   *
   * client
   *   .documentTextDetection(request)
   *   .then(response => {
   *     // doThingsWith(response);
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  methods.documentTextDetection = promisify(
    _createSingleFeatureMethod(features.DOCUMENT_TEXT_DETECTION)
  );
  /**
   * Annotate a single image with the result from Product Search.
   *
   * @see v1p3beta1.ImageAnnotatorClient#batchAnnotateImages
   * @see google.cloud.vision.v1p3beta1.AnnotateImageRequest
   *
   * @method v1p3beta1.ImageAnnotatorClient#productSearch
   * @param {object|string|Buffer} request A representation of the request
   *     being sent to the Vision API. This is an
   *     {@link google.cloud.vision.v1p3beta1.AnnotateImageRequest AnnotateImageRequest}.
   *     For simple cases, you may also send a string (the URL or filename of
   *     the image) or a buffer (the image itself).
   * @param {object} request.image A dictionary-like object representing the
   *     image. This should have a single key (`source`, `content`).
   *
   *     If the key is `source`, the value should be another object containing
   *     `imageUri` or `filename` as a key and a string as a value.
   *
   *     If the key is `content`, the value should be a Buffer.
   * @param {object} [callOptions] Optional parameters. You can override the
   *     default settings for this call, e.g, timeout, retries, paginations,
   * @param {function(?Error, ?object)} [callback] The function which will be
   *     called with the result of the API call.
   *
   *     The second parameter to the callback is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   * @returns {Promise} The promise which resolves to an array. The first
   *     element of the array is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   *     The promise has a method named "cancel" which cancels the ongoing API
   *     call.
   *
   * @example
   * const vision = require('@google-cloud/vision').v1p3beta1;
   * const client = new vision.ImageAnnotatorClient();
   *
   * const request = {
   *   image: {
   *     source: {imageUri: 'gs://path/to/image.jpg'}
   *   }
   * };
   *
   * client
   *   .productSearch(request)
   *   .then(response => {
   *     // doThingsWith(response);
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  if (features!.PRODUCT_SEARCH !== undefined) {
    methods.productSearch = promisify(
      _createSingleFeatureMethod(features!.PRODUCT_SEARCH)
    );
  }
  /**
   * Annotate a single image with localization vectors.
   *
   * @see v1p3beta1.ImageAnnotatorClient#batchAnnotateImages
   * @see google.cloud.vision.v1p3beta1.AnnotateImageRequest
   *
   * @method v1p3beta1.ImageAnnotatorClient#objectLocalization
   * @param {object|string|Buffer} request A representation of the request
   *     being sent to the Vision API. This is an
   *     {@link google.cloud.vision.v1.AnnotateImageRequest AnnotateImageRequest}.
   *     For simple cases, you may also send a string (the URL or filename of
   *     the image) or a buffer (the image itself).
   * @param {object} request.image A dictionary-like object representing the
   *     image. This should have a single key (`source`, `content`).
   *
   *     If the key is `source`, the value should be another object containing
   *     `imageUri` or `filename` as a key and a string as a value.
   *
   *     If the key is `content`, the value should be a Buffer.
   * @param {object} [callOptions] Optional parameters. You can override the
   *     default settings for this call, e.g, timeout, retries, paginations,
   *     etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions}
   *     for the details.
   * @param {function(?Error, ?object)} [callback] The function which will be
   *     called with the result of the API call.
   *
   *     The second parameter to the callback is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   * @returns {Promise} The promise which resolves to an array. The first
   *     element of the array is an object representing
   *     [BatchAnnotateImagesResponse]{@link BatchAnnotateImagesResponse}.
   *     The promise has a method named "cancel" which cancels the ongoing API
   *     call.
   *
   * @example
   * // Object localization is only available in v1p3beta1.
   * const vision = require('@google-cloud/vision').v1p3beta1;
   * const client = new vision.ImageAnnotatorClient();
   *
   * const request = {
   *   image: {
   *     source: {imageUri: 'gs://path/to/image.jpg'}
   *   }
   * };
   *
   * client
   *   .objectLocalization(request)
   *   .then(response => {
   *     // doThingsWith(response);
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  if (features!.OBJECT_LOCALIZATION !== undefined) {
    methods.objectLocalization = promisify(
      _createSingleFeatureMethod(features!.OBJECT_LOCALIZATION)
    );
  }
  return methods;
}
