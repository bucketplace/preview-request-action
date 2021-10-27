import * as core from '@actions/core'
import {requestPreview} from './request-preview'

async function run(): Promise<void> {
  try {
    const application: string = core.getInput('application', {required: true})
    const branch: string = core.getInput('branch', {required: true})
    const prTitle: string = core.getInput('pr-title', {required: true})
    const prUrl: string = core.getInput('pr-url', {required: true})
    const prAssignee: string = core.getInput('pr-assignee')
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
    const domainPrefix: string = core.getInput('domain-prefix')

    const endpoint = await requestPreview(application, branch, {
      pr_title: prTitle,
      pr_url: prUrl,
      pr_assignee: prAssignee,
      profile,
      destination,
      base_domain: baseDomain,
      manifest_path: manifestPath,
      manifest_repo: manifestRepo ? manifestRepo : undefined,
      image_tag: imageTag,
      image_repo: imageRepo ? imageRepo : undefined,
      ingress_prefix: ingressPrefix ? ingressPrefix : undefined,
      domain_prefix: domainPrefix ? domainPrefix : undefined
    })

    core.setOutput('endpoint', endpoint)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
