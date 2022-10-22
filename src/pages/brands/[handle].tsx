import React from "react"
import { ReactElement } from "react"
import { NextPageWithLayout } from "types/global"
import Layout from "@modules/layout/templates"
import { useRouter } from "next/router"

// stylesheet
import styles from "./brands.module.css"
import Button from "@modules/common/components/button"
// import { BrandsData } from "../../assets/brandsData"
// import Card from "@modules/layout/templates/brand/Card"
import Tabs from "@modules/layout/templates/tabs/Tabs"
import Tab from "@modules/layout/templates/tabs/Tab"
import { axiosRequest } from "@lib/axios/Axios"
import { medusaClient } from "@lib/config"

const BrandsPage: NextPageWithLayout = ({ data }: any) => {
  const router = useRouter()

  console.log("BRANDS_DETAILS: ", data)

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.brands__details}>
      <div className={styles.hero}>
        {data.brand && (
          <div className={styles.brand__info}>
            <h2>{data?.brand?.name}</h2>
            <h4>{data?.brand?.description}</h4>
            <Button
              style={{
                marginTop: "2rem",
                fontSize: "1.2rem",
                width: "200px",
                borderRadius: "5px",
              }}
            >
              Hey There
            </Button>
          </div>
        )}
        <div className={styles.banner__image}>
          <div>
            <img src="/images/image3.jpg" alt="brand name" />
          </div>
          <div>
            <img src="/images/image1.jpg" alt="brand name" />
          </div>
        </div>
      </div>

      <div className={styles.tabs__container}>
        {data.brand && (
          <Tabs>
            {data.brand.brand_collections.map(
              async (collection: any, index: number) => {
                const data = await medusaClient.products.list({})

                console.log("DATA: ", data)

                return (
                  <Tab key={index + collection.title} title={collection.title}>
                    <div></div>
                  </Tab>
                )
              }
            )}
            {/* <Tab title="Category One">
            <div className="brands__list diff">
              {BrandsData &&
                BrandsData.length > 0 &&
                BrandsData.map((brand, index) => {
                  return (
                    <Card
                      key={index}
                      path={`/brand/${brand.brandhandle}`}
                      brandImage={brand.brandImage}
                      brandName={brand.brandName}
                      isProduct={true}
                      price={45}
                    />
                  )
                })}
            </div>
          </Tab>
          <Tab title="Category Two">
            <div></div>
          </Tab>
          <Tab title="Category Three">
            <div></div>
          </Tab>
          <Tab title="Category Four">
            <div></div>
          </Tab> */}
          </Tabs>
        )}
      </div>
    </div>
  )
}

BrandsPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export async function getStaticPaths() {
  const config = {
    "Content-Type": "application/json",
  }
  const res = await axiosRequest(
    "GET",
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/brand`,
    {},
    config
  )
  const data = res
  const paths = data?.brands.map((brand: any) => ({
    params: { handle: brand.handle },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: true }
}

export async function getStaticProps(context: any) {
  const config = {
    "Content-Type": "application/json",
  }
  const res = await axiosRequest(
    "GET",
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/brands/${context.params.handle}`,
    {},
    config
  )
  const data = res

  return {
    props: {
      data,
    },
  }
}

export default BrandsPage
