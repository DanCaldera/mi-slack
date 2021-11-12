import List from '@editorjs/list';
import LinkTool from '@editorjs/link';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import Delimiter from '@editorjs/delimiter';
import SimpleImage from '@editorjs/simple-image';
import Paragraph from '@editorjs/paragraph';

const constants = {
  marker: Marker,
  list: List,
  linkTool: LinkTool,
  header: Header,
  quote: Quote,
  delimiter: Delimiter,
  image: SimpleImage,
  paragraph: {
    class: Paragraph,
    inlineToolbar: true
  }
};

export default constants;
