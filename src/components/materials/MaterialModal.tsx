import { faPenToSquare, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'
import styles from './MaterialModal.module.css'

export interface MaterialSupplier {
  id: string
  name: string
  url: string
}

export interface MaterialModalData {
  id: string
  name: string
  description: string
  category: string
  imageUrl?: string
  suppliers: MaterialSupplier[]
}

interface MaterialModalProps {
  isOpen: boolean
  onClose: () => void
  material: MaterialModalData | null
  onEdit: (material: MaterialModalData) => void
}

const MAX_SUPPLIERS = 8

export default function MaterialModal({
  isOpen,
  onClose,
  material,
  onEdit
}: MaterialModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !material) {
    return null
  }

  const suppliers = material.suppliers.slice(0, MAX_SUPPLIERS)

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button className={styles.closeButton} onClick={onClose} aria-label="Fechar modal">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className={styles.content}>
          <section className={styles.leftColumn}>
            <div className={styles.imageWrap}>
              {material.imageUrl ? (
                <img src={material.imageUrl} alt={material.name} className={styles.image} />
              ) : (
                <div className={styles.placeholderImage}>Sem imagem</div>
              )}
            </div>

            <span className={styles.categoryBadge}>{material.category}</span>
            <h2 className={styles.materialTitle}>{material.name}</h2>
            <p className={styles.description}>{material.description}</p>

            <button
              type="button"
              className={styles.editButton}
              onClick={() => onEdit(material)}
              aria-label="Editar material"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
              Editar material
            </button>
          </section>

          <section className={styles.rightColumn}>
            <h3 className={styles.sectionTitle}>Fornecedores</h3>

            {suppliers.length > 0 ? (
              suppliers.map((supplier, index) => (
                <div className={styles.supplierRow} key={supplier.id}>
                  <label htmlFor={supplier.id} className={styles.supplierLabel}>
                    Fornecedor {index + 1}
                  </label>

                  <div className={styles.supplierActions}>
                    <input
                      id={supplier.id}
                      className={styles.supplierInput}
                      readOnly
                      value={supplier.name}
                    />

                    <a
                      className={styles.linkButton}
                      href={supplier.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Abrir link de compra do ${supplier.name}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M7 7H17V17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 7L7 17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptySuppliers}>Nenhum fornecedor cadastrado.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
