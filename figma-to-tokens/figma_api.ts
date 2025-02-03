export default class FigmaApi {
  private baseUrl = 'https://api.figma.com'
  private token: string

  constructor(token: string) {
    this.token = token
  }

  async getLocalVariables(fileKey: string) {
    const resp = await fetch(
      `${this.baseUrl}/v1/files/${fileKey}/variables/local`,
      {
        headers: {
          Accept: '*/*',
          'X-Figma-Token': this.token,
        },
      },
    )

    return await resp.json()
  }
  async getLocalStyles(fileKey: string) {
    const resp = await fetch(
      `${this.baseUrl}/v1/files/${fileKey}/styles`,
      {
        headers: {
          Accept: '*/*',
          'X-Figma-Token': this.token,
        },
      },
    )

    return await resp.json()
  }

  async getComponents(fileKey: string) {
    const resp = await fetch(
      `${this.baseUrl}/v1/files/${fileKey}/components`,
      {
        headers: {
          Accept: '*/*',
          'X-Figma-Token': this.token,
        },
      },
    )

    return await resp.json()
  }
}
