import * as core from '@actions/core'
import {requestPreview} from './request-preview'

async function run(): Promise<void> {
  try {
    const application: string = core.getInput('application', {required: true})
    const branch: string = core.getInput('branch', {required: true})
    const profile: string = core.getInput('profile', {required: true})
    const destination: string = core.getInput('destination', {required: true})
    const baseDomain: string = core.getInput('base-domain', {required: true})
    const manifestPath: string = core.getInput('manifest-path', {
      required: true
    })
    const manifestRepo: string = core.getInput('manifest-repo')
    const imageTag: string = core.getInput('image-tag', {required: true})
    const imageRepo: string = core.getInput('image-repo')
    const ingressPrefix: string = core.getInput('ingress-prefix')

    const endpoint = await requestPreview(application, branch, {
      profile,
      destination,
      base_domain: baseDomain,
      manifest_path: manifestPath,
      manifest_repo: manifestRepo ? manifestRepo : undefined,
      image_tag: imageTag,
      image_repo: imageRepo ? imageRepo : undefined,
      ingress_prefix: ingressPrefix ? ingressPrefix : undefined
    })

    core.setOutput('endpoint', endpoint)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
