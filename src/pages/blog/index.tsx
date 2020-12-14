import { graphql, Link } from 'gatsby'
import React from 'react'
import Section from '../../components/common/Section'
import Layout from '../../components/Layout'
import Img from 'gatsby-image'
import Container from '../../components/common/Container'

import styles from './blog.module.scss'

export default function Blog({ data }: { data: GatsbyTypes.BlogQuery }) {
  const { edges: posts } = data.allMarkdownRemark

  return (
    <Layout>
      <Section>
        <Container size='large'>
          <h1 className={styles.header}>Blog landing page</h1>

          <div className={styles.grid}>
            {posts.map(({ node: post }) => {
              if (!post.fields || !post.frontmatter || !post.frontmatter.metadata) {
                return null
              }

              const { slug = '/' } = post.fields
              const { publishDate = '' } = post.frontmatter
              const { title = '', description = '', image } = post.frontmatter.metadata

              return (
                <Post
                  key={post.id}
                  title={title}
                  description={description}
                  publishDate={publishDate}
                  image={image as GatsbyTypes.File}
                  path={slug}
                />
              )
            })}
          </div>
        </Container>
      </Section>
    </Layout>
  )
}

export const pageQuery = graphql`
  query Blog {
    allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/(blog)/" } }) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            metadata {
              title
              description
              image {
                childImageSharp {
                  fluid(maxWidth: 512, quality: 100) {
                    ...GatsbyImageSharpFluid_withWebp
                  }
                }
              }
            }
            publishDate
          }
        }
      }
    }
  }
`

interface PostProps {
  title: string
  description: string
  publishDate: string
  image?: GatsbyTypes.File
  path: string
}
function Post({ title, description, image, publishDate, path }: PostProps) {
  const imageFluid = image?.childImageSharp?.fluid

  return (
    <Link to={path} className={styles.post}>
      {imageFluid && <Img fluid={imageFluid} className={styles.image} />}

      <div className={styles.content}>
        <span className={styles.publishDate}>{publishDate}</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
    </Link>
  )
}
