import React, {
  FC,
  useMemo,
  useState,
  cloneElement,
  ReactElement,
} from 'react';
import { GalleryWrapperProps } from './GalleryWrapper';
import './container.css';

interface GalleryContainerProps {
  children: ReactElement | ReactElement[];
  enableVerticalMode?: boolean;
}

const GalleryContainer: FC<GalleryContainerProps> = ({
  children,
  enableVerticalMode,
}) => {
  const [selectedCompIndex, setSelectedComponentIndex] = useState<number>(-1);

  const [verticalMode, setVerticalMode] = useState<boolean>(false);
  const [verticalWidth, setVerticalWidth] = useState<number>(1080);
  const [verticalWidthInput, setVerticalWidthInput] = useState<string>('');

  const { childArray, childrenWithDividers } = useMemo(() => {
    const processedChildren: {
      childArray: ReactElement<Omit<GalleryWrapperProps, 'children'>>[];
      childrenWithDividers: (
        | {
            type: 'child';
            child: ReactElement<Omit<GalleryWrapperProps, 'children'>>;
            index: number;
          }
        | {
            type: 'divider';
            description: string;
          }
      )[];
    } = {
      childArray: [],
      childrenWithDividers: [],
    };
    if (!children || typeof children !== 'object') {
      return processedChildren;
    }

    const childArray: ReactElement<Omit<GalleryWrapperProps, 'children'>>[] =
      !Array.isArray(children) ? [children] : children;

    for (const child of childArray) {
      if (!child.props.description) {
        continue;
      }
      processedChildren.childArray.push(child);
    }
    processedChildren.childArray.sort((a, b) => {
      const groupA = a.props.g || '~';
      const groupB = b.props.g || '~';
      if (groupA === groupB) {
        return 0;
      }
      return groupA > groupB ? 1 : -1;
    });

    let prevGroup =
      processedChildren.childArray[processedChildren.childArray.length - 1]
        .props.g;

    processedChildren.childArray.forEach((c, i) => {
      const group = c.props.g;
      if (prevGroup !== group) {
        //A new group has been found, insert a divider.
        processedChildren.childrenWithDividers.push({
          type: 'divider',
          description: group || '~',
        });
        prevGroup = group;
      }

      processedChildren.childrenWithDividers.push({
        type: 'child',
        child: c,
        index: i,
      });
    });

    return processedChildren;
  }, [children]);

  const isSelectedVertical = useMemo(() => {
    if (selectedCompIndex === -1) {
      return verticalMode;
    }
    return typeof childArray[selectedCompIndex].props.verticalMode === 'boolean'
      ? childArray[selectedCompIndex].props.verticalMode
      : verticalMode;
  }, [childArray, selectedCompIndex, verticalMode]);

  if (childArray.length === 0) {
    return <div>No components to show.</div>;
  }

  return (
    <div className="gallery_Container">
      <div className="leftPanel">
        {enableVerticalMode && (
          <div
            className="verticalModeIndicator"
            onClick={() => setVerticalMode(!verticalMode)}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                padding: '2px',
                backgroundColor: 'white',
                border: '2px solid gray',
                marginRight: 2,
              }}
            >
              {verticalMode && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'green',
                    borderRadius: '3px',
                  }}
                />
              )}
            </div>
            Vertical mode
            <input
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '50px',
                height: '20px',
                fontSize: '12px',
                marginLeft: '50px',
              }}
              type="number"
              value={verticalWidthInput || verticalWidth}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (isFinite(value)) {
                  setVerticalWidthInput(value.toString());
                  setVerticalWidth(value);
                } else {
                  setVerticalWidthInput(e.target.value);
                }
              }}
            />
            px
          </div>
        )}
        {childrenWithDividers.map((c, i) =>
          c.type === 'divider' ? (
            <div
              key={i + '-' + c.description + '-' + c.type}
              className="divider"
            >
              {c.description}
            </div>
          ) : (
            <div
              key={i + '-' + c.child.props.description}
              onClick={() => setSelectedComponentIndex(c.index)}
              className={
                'panelItem ' +
                (selectedCompIndex === c.index ? ' selected' : ' unselected')
              }
            >
              <div
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '13px',
                  fontWeight: 300,
                }}
              >
                {c.child.props.description}
              </div>
            </div>
          ),
        )}
      </div>
      <div
        className={`contentPanel ${
          isSelectedVertical ? 'verticalMode' : 'horizontalMode'
        }`}
        style={
          isSelectedVertical
            ? { flexGrow: 0, width: `${verticalWidth}px` }
            : undefined
        }
      >
        {selectedCompIndex === -1 && 'No component selected'}
        {selectedCompIndex > -1 &&
          cloneElement(childArray[selectedCompIndex], {
            verticalMode: isSelectedVertical,
          })}
      </div>
    </div>
  );
};

export default GalleryContainer;
