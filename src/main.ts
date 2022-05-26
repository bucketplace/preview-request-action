import * as core from '@actions/core'
import {requestPreview} from './request-preview'

async function run(): Promise<void> {
  try {
    const application: string = core.getInput('application', {required: true})
    const branch: string = core.getInput('branch', {required: true})
    const releaseNameLength: string = core.getInput('release-name-length')
    const prTitle: string = core.getInput('pr-title', {required: true})
    const prUrl: string = core.getInput('pr-url', {required: true})
    const prAssignee: string = core.getInput('pr-assignee')
    const profile: string = core.getInput('profile', {required: true})
    const destination: string = core.getInput('destination', {required: true})
    const baseDomain: string = core.getInput('base-domain', {required: true})
    const imageTag: string = core.getInput('image-tag', {required: true})
    const ingressHostKey: string = core.getInput('ingress-host-key')
    const overrideValuesStr: string = core.getInput('override-values')
    const overrideValues = overrideValuesStr
      ? JSON.parse(overrideValuesStr)
      : undefined

    const {endpoint, context} = await requestPreview(
      application,
      {
        branch,
        release_name_length: releaseNameLength ? releaseNameLength : undefined,
      },
      {
        pr_title: prTitle,
        pr_url: prUrl,
        pr_assignee: prAssignee ? prAssignee : undefined,
        profile,
        destination,
        base_domain: baseDomain,
        image_tag: imageTag,
        ingress_host_key: ingressHostKey ? ingressHostKey : undefined,
        override_values: overrideValues
      }
    )

    core.setOutput('endpoint', endpoint)
    core.setOutput('context', context)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
