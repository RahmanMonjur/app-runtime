import {
    ResolvedResourceQuery,
    QueryParameters,
    QueryParameterValue,
} from '../../engine'
import { joinPath } from './path'

const encodeQueryParameter = (param: QueryParameterValue): string => {
    if (Array.isArray(param)) {
        return param.map(encodeQueryParameter).join(',')
    }
    if (typeof param === 'string') {
        return encodeURIComponent(param)
    }
    if (typeof param === 'number') {
        return String(param)
    }
    if (typeof param === 'object') {
        throw new Error('Object parameter mappings not yet implemented')
    }
    throw new Error('Unknown parameter type')
}

type ExpandedParam = {
    key: string
    value: QueryParameterValue
}

const queryParametersMapToArray = (
    params: QueryParameters
): Array<ExpandedParam> =>
    Object.keys(params).reduce((out, key) => {
        const value = params[key]
        if (key === 'filter' && Array.isArray(value)) {
            value.forEach(item => {
                out.push({
                    key: 'filter',
                    value: item,
                })
            })
        } else if (params[key] !== null && params[key] !== undefined) {
            out.push({
                key,
                value: params[key],
            })
        }
        return out
    }, [] as Array<ExpandedParam>)

const queryParametersToQueryString = (params: QueryParameters): string => {
    const expandedParams = queryParametersMapToArray(params)

    return expandedParams
        .map(
            ({ key, value }) =>
                `${encodeURIComponent(key)}=${encodeQueryParameter(value)}`
        )
        .join('&')
}

const actionPrefix = 'action::'

const isAction = (resource: string) => resource.startsWith(actionPrefix)
const makeActionPath = (resource: string) =>
    joinPath(
        'dhis-web-commons',
        `${resource.substr(actionPrefix.length)}.action`
    )

export const queryToResourcePath = (
    apiPath: string,
    { resource, id, params = {} }: ResolvedResourceQuery
): string => {
    const base = isAction(resource)
        ? makeActionPath(resource)
        : joinPath(apiPath, resource, id)

    if (Object.keys(params).length) {
        return `${base}?${queryParametersToQueryString(params)}`
    }
    return base
}
