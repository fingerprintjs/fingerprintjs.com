import CMS from 'netlify-cms-app'

import { LongFormContentPreview } from '../templates/long-form-content'
import { StaticPageContentPreview } from '../templates/static-page-content'

CMS.registerPreviewTemplate('blog', LongFormContentPreview)
CMS.registerPreviewTemplate('index', StaticPageContentPreview)
