import { graphql } from 'gatsby'
import React from 'react'
import { LayoutTemplate } from '../components/Layout'
import { PreviewTemplateComponentProps } from 'netlify-cms-core'
import Section from '../components/common/Section'
import Container from '../components/common/Container'
import { baseUrl } from '../constants/content'

import styles from './long-form-content.module.scss'

const HtmlContent = ({ content, className }: { content: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
)

const Content = ({ content, className }: { content: string | React.ReactNode; className?: string }) => (
  <div className={className}>{content}</div>
)

export default function LongFormContent({ data }: { data: GatsbyTypes.LongFormContentQuery }) {
  if (
    data.markdownRemark?.frontmatter === undefined ||
    data.markdownRemark?.frontmatter?.metadata === undefined ||
    data.markdownRemark?.html === undefined
  ) {
    return null
  }

  const metadata = mapToMetadata(data.markdownRemark.frontmatter.metadata)
  const body = data.markdownRemark.html

  return <LongFormContentTemplate contentComponent={HtmlContent} metadata={metadata} body={body} />
}

export const pageQuery = graphql`
  query LongFormContent($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        metadata {
          title
          description
          url
          image {
            publicURL
          }
        }
      }
    }
  }
`

interface TemplateProps {
  metadata: GatsbyTypes.SiteSiteMetadata
  body: string | React.ReactNode
  contentComponent?: React.FunctionComponent<{ content: string | React.ReactNode; className?: string }>
}
export function LongFormContentTemplate({ metadata, body, contentComponent }: TemplateProps) {
  const ContentComponent = contentComponent ?? Content

  return (
    <LayoutTemplate siteMetadata={metadata}>
      <Section className={styles.root}>
        <Container className={styles.container}>
          <h1 className={styles.title}>{metadata.title}</h1>

          <ContentComponent content={body} className={styles.content} />
        </Container>
      </Section>
    </LayoutTemplate>
  )
}

export function LongFormContentPreview({ entry, widgetFor }: PreviewTemplateComponentProps) {
  const metadata = entry.getIn(['data', 'metadata'])?.toObject() as QueryMetadata

  return <LongFormContentTemplate metadata={mapToMetadata(metadata)} body={widgetFor('body') ?? <></>} />
}

type QueryMetadata = NonNullable<
  NonNullable<GatsbyTypes.LongFormContentQuery['markdownRemark']>['frontmatter']
>['metadata']
function mapToMetadata(queryMetadata: QueryMetadata): GatsbyTypes.SiteSiteMetadata {
  return {
    title: queryMetadata?.title ?? '',
    description: queryMetadata?.description ?? '',
    url: queryMetadata?.url ?? '',
    image: `${baseUrl}${queryMetadata?.image}` ?? '',
  } as GatsbyTypes.SiteSiteMetadata
}
