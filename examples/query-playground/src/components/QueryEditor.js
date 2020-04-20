import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, RadioGroup, Radio } from '@dhis2/ui-core'
import styles from './QueryEditor.styles'
import { useDataEngine } from '@dhis2/app-runtime'
import { Editor } from './Editor'
import i18n from '@dhis2/d2-i18n'

const defaultQuery = {
    me: {
        resource: 'me',
    },
}

const stringify = obj => JSON.stringify(obj, undefined, 2)

export const QueryEditor = ({ setResult }) => {
    const [type, setType] = useState('query')
    const [query, setQuery] = useState(stringify(defaultQuery))
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const engine = useDataEngine()

    const onClick = () => {
        setLoading(true)
        setResult('...')
        setError(null)
        try {
            const parsed = JSON.parse(query)
            const promise =
                type === 'query' ? engine.query(parsed) : engine.mutate(parsed)
            promise
                .then(result => {
                    setLoading(false)
                    setResult(stringify(result))
                })
                .catch(error => {
                    setLoading(false)
                    setError(String(error))
                    setResult(
                        `ERROR: ${error.message}\n${stringify(error.details)}`
                    )
                })
        } catch (e) {
            setError(`JSON Parse Error: ${e}`)
            setLoading(false)
            setResult('ERROR: ')
        }
    }

    return (
        <div className="editor">
            <style jsx>{styles}</style>
            <Editor
                value={query}
                theme="monokai"
                onChange={setQuery}
                name="editor"
                placeholder={i18n.t('Enter a query here...')}
                focus={true}
            />
            {error && <span className="error">{error}</span>}
            <div className="controls">
                <div className="radio-group">
                    <RadioGroup
                        name="type"
                        label="Type"
                        onChange={e => setType(e.target.value)}
                        value={type}
                    >
                        <Radio label={i18n.t('Query')} value="query" />
                        <Radio label={i18n.t('Mutation')} value="mutation" />
                    </RadioGroup>
                </div>
                <Button
                    className="execute-button"
                    primary
                    disabled={loading}
                    onClick={onClick}
                >
                    {i18n.t('Execute')}
                </Button>
            </div>
        </div>
    )
}

QueryEditor.propTypes = {
    setResult: PropTypes.func.isRequired,
}
