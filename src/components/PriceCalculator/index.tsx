import React, { useState } from 'react'
import Select from '../common/Select'
import classNames from 'classnames'
import { minimumIdentifications, pricingTable, calculatePrice } from '../../helpers/pricing'
import { PaymentType } from '../../types/PaymentType'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ContactSalesForm from '../../components/ContactSalesForm'
import { numberFormatter } from '../../helpers/format'
import styles from './PriceCalculator.module.scss'

export default function PriceCalculator() {
  const selectOptions = pricingTable.map((entry) => ({
    label: numberFormatter.format(entry.value),
    value: entry.value,
  }))
  selectOptions.push({ label: `${numberFormatter.format(10000000)}+`, value: Infinity })

  const [selectedPreset, setSelectedPreset] = useState(selectOptions[0])
  const [customCount, setCustomCount] = useState<number | undefined>(undefined)
  const [isContactSalesModalOpen, setIsContactSalesModalOpen] = useState(false)

  function isCustomPricing() {
    return (!customCount && selectedPreset.value === Infinity) || (customCount && customCount >= 10000000)
  }

  function onPresetSelected(newPreset: ValuePreset): void {
    setSelectedPreset(newPreset)

    // A preset was selected, clear the custom count.
    setCustomCount(undefined)
  }

  function onCustomCountChanged(newCustomCount: string): void {
    if (newCustomCount !== '') {
      setCustomCount(parseInt(newCustomCount, 10))
    } else {
      setCustomCount(undefined)
    }
  }

  function getPrice(paymentType: PaymentType) {
    return customCount === undefined
      ? calculatePrice(selectedPreset.value, paymentType)
      : calculatePrice(customCount >= minimumIdentifications ? customCount : minimumIdentifications, paymentType)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <Column title='How many identifications per month do you need?'>
          <div className={styles.presetSelector}>
            <div className={styles.description}>
              <strong>Select from preset</strong>
            </div>
            <Select<ValuePreset>
              value={customCount === undefined ? selectedPreset : null}
              options={selectOptions}
              onChange={onPresetSelected}
            />
          </div>
          <div className={styles.customInput}>
            <div className={styles.description}>Or type a specific number</div>
            <input
              value={customCount ?? ''}
              onChange={(e) => onCustomCountChanged(e.target.value)}
              type='number'
              name='identification-user-input'
              placeholder='ex. 630,000'
            />
          </div>
        </Column>
        <Column title={'On-Demand'}>
          <Price
            value={isCustomPricing() ? 'Custom' : getPrice(PaymentType.Monthly)}
            description='Pay as you go, cancel any time'
          />
        </Column>
        <Column title='Annual'>
          <Price
            value={isCustomPricing() ? 'Custom' : getPrice(PaymentType.Annually)}
            description='Requires a 12 month prepay'
          />
        </Column>
        <Column title='Enterprise License'>
          {isCustomPricing() ? (
            <div className={styles.description}>Custom pricing for high traffic websites</div>
          ) : (
            <div className={styles.description}>Enterprise support license with SLA</div>
          )}
          <Button variant='outline' small onClick={() => setIsContactSalesModalOpen(true)}>
            Contact Sales
          </Button>
        </Column>
      </div>

      <Modal title='Contact Sales' open={isContactSalesModalOpen} onClose={() => setIsContactSalesModalOpen(false)}>
        <ContactSalesForm />
      </Modal>
    </>
  )
}

interface ColumnProps {
  title: string
  children: React.ReactNode
}

function Column({ title, children }: ColumnProps) {
  return (
    <div className={styles.column}>
      <div className={classNames(styles.row, styles.header)}>{title}</div>
      <div className={styles.row}>{children}</div>
    </div>
  )
}

interface PriceProps {
  value: string
  description: string
}

function Price({ value, description }: PriceProps) {
  return (
    <>
      <div className={styles.price}>
        <div className={styles.value}>{value}</div>
        <div className={styles.subtitle}>per month</div>
      </div>
      <div className={styles.description}>{description}</div>
    </>
  )
}

interface ValuePreset {
  label: string
  value: number
}
